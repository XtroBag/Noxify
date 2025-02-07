import { glob } from "glob";
import Logger from "./Logger";
import {
  Interaction,
  ButtonInteraction,
  ModalSubmitInteraction,
  AnySelectMenuInteraction,
} from "discord.js";
import { DiscordClient } from "./DiscordClient";
import { componentsFolderName } from "../../config";
import { ComponentModule, ComponentTypes } from "../types/Component";

export async function registerComponents(client: DiscordClient): Promise<void> {
  const componentPaths: string[] = await glob(
    `**/${componentsFolderName}/**/**/*.js`
  );

  for (const componentPath of componentPaths) {
    const importPath: string = `../..${componentPath.replace(
      /^dist[\\\/]|\\/g,
      "/"
    )}`;

    try {
      const module: ComponentModule<any> = (await import(importPath)).default; // Using any for initial inference
      const { id, group, type } = module;

      // Type inference based on component type
      switch (type) {
        case ComponentTypes.Button:
          if (id || group) {
            if (Array.isArray(id)) {
              client.components[type].set(group!, {
                ...module,
              } as ComponentModule<ButtonInteraction>);
            } else {
              client.components[type].set(
                id || group!,
                module as ComponentModule<ButtonInteraction>
              );
            }
          }
          break;

        case ComponentTypes.SelectMenu:
          if (id || group) {
            if (Array.isArray(id)) {
              client.components[type].set(group!, {
                ...module,
              } as ComponentModule<AnySelectMenuInteraction>);
            } else {
              client.components[type].set(
                id || group!,
                module as ComponentModule<AnySelectMenuInteraction>
              );
            }
          }
          break;

        case ComponentTypes.Modal:
          if (id || group) {
            if (Array.isArray(id)) {
              client.components[type].set(group!, {
                ...module,
              } as ComponentModule<ModalSubmitInteraction>);
            } else {
              client.components[type].set(
                id || group!,
                module as ComponentModule<ModalSubmitInteraction>
              );
            }
          }
          break;

        default:
          Logger.issue(`File might be empty or missing the necessary handler.`);
      }
    } catch (err) {
      Logger.error(`Failed to load component at ${importPath}`, err);
    }
  }
}

export async function handleComponents(
  client: DiscordClient,
  interaction: Interaction
): Promise<void> {
  const { componentId, customId, extras } = getIds(interaction);
  if (interaction.isButton() || interaction.isAnySelectMenu())
    interaction.customId = customId;

  if (!componentId) {
    return Logger.error("The component id could not be filtered.", interaction);
  }

  const component =
    client.components[getComponentType(interaction)]?.get(componentId);
  const errorIdMessage = `group=${
    componentId === customId ? "none" : componentId
  } id:${customId}`;

  if (!component) return;

  if (interaction.isModalSubmit() && component.group) {
    return Logger.error(
      `The parameter group in ${errorIdMessage} is not allowed.`
    );
  }

  try {
    // Dynamically determine interaction type based on component type
    switch (getComponentType(interaction)) {
      case ComponentTypes.Button:
        await (
          component as ComponentModule<ButtonInteraction<"cached">>
        ).execute(client, interaction as ButtonInteraction<"cached">, extras);
        break;
      case ComponentTypes.SelectMenu:
        await (
          component as ComponentModule<AnySelectMenuInteraction<"cached">>
        ).execute(
          client,
          interaction as AnySelectMenuInteraction<"cached">,
          extras
        );
        break;
      case ComponentTypes.Modal:
        // When handling modal interactions, pass extras along with other arguments
        await (
          component as ComponentModule<ModalSubmitInteraction<"cached">>
        ).execute(
          client,
          interaction as ModalSubmitInteraction<"cached">,
          extras
        );
        break;
      default:
        Logger.error(`Unknown component type for interaction: ${interaction}`);
        break;
    }
  } catch (err) {
    return Logger.error(
      `Error executing component with id: ${errorIdMessage}`,
      err
    );
  }
}

// Get component ID and extras from interaction
function getIds(interaction: Interaction) {
  let customId = "";
  let componentId = "";
  let extras: string[] = [];

  if (interaction.isButton() || interaction.isAnySelectMenu()) {
    const [idPart, ...userParts] = interaction.customId.split("|");

    componentId = idPart;

    if (userParts.length > 0) {
      extras = userParts;
    }

    customId = interaction.customId;
  } else if (interaction.isModalSubmit()) {
    // For modals, we allow extras to be passed in the customId as well
    const [idPart, ...userParts] = interaction.customId.split("|");

    componentId = idPart;
    customId = interaction.customId;

    if (userParts.length > 0) {
      extras = userParts;
    }
  }

  return {
    componentId,
    customId,
    extras,
  };
}

// Get the correct component type based on interaction
function getComponentType(interaction: Interaction): ComponentTypes {
  if (interaction.isButton()) return ComponentTypes.Button;
  else if (interaction.isAnySelectMenu()) return ComponentTypes.SelectMenu;
  else return ComponentTypes.Modal;
}
