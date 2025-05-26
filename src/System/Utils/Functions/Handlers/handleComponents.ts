import { glob } from "glob";
import Logger from "./Logger.js";
import {
  Interaction,
  ButtonInteraction,
  ModalSubmitInteraction,
  AnySelectMenuInteraction,
} from "discord.js";
import { DiscordClient } from "./DiscordClient.js";
import { componentsFolderName } from "../../../../config.js";
import { ComponentModule, ComponentTypes } from "../../../Types/Component.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function registerComponents(client: DiscordClient): Promise<void> {
  const componentPaths: string[] = await glob(
    `dist/${componentsFolderName}/**/**/*.js`
  );


    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

  for (const componentPath of componentPaths) {

       const absolutePath = path.resolve(componentPath);
       const relativePath = path
         .relative(__dirname, absolutePath)
         .replace(/\\/g, "/");
   
       const importPath = `./${relativePath}`;

    try {
      const module: ComponentModule<any> = (await import(importPath)).default;
      const { id, type } = module;

      if (!id) {
        Logger.issue(`Component at ${importPath} is missing an 'id' field.`);
        continue;
      }

      switch (type) {
        case ComponentTypes.Button:
          client.components[type].set(
            id,
            module as ComponentModule<ButtonInteraction>
          );
          break;

        case ComponentTypes.SelectMenu:
          client.components[type].set(
            id,
            module as ComponentModule<AnySelectMenuInteraction>
          );
          break;

        case ComponentTypes.Modal:
          client.components[type].set(
            id,
            module as ComponentModule<ModalSubmitInteraction>
          );
          break;

        default:
          Logger.issue(`Unknown or missing component type at ${importPath}.`);
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
  const { componentId, customId, params } = getIds(interaction);

  if (interaction.isButton() || interaction.isAnySelectMenu()) {
    interaction.customId = customId;
  }

  if (!componentId) {
    return Logger.error("The component id could not be filtered.", interaction);
  }

  const component =
    client.components[getComponentType(interaction)]?.get(componentId);

  if (!component) return;

  try {
    switch (getComponentType(interaction)) {
      case ComponentTypes.Button:
        await (
          component as ComponentModule<ButtonInteraction<"cached">>
        ).execute(client, interaction as ButtonInteraction<"cached">, params);
        break;

      case ComponentTypes.SelectMenu:
        await (
          component as ComponentModule<AnySelectMenuInteraction<"cached">>
        ).execute(
          client,
          interaction as AnySelectMenuInteraction<"cached">,
          params
        );
        break;

      case ComponentTypes.Modal:
        await (
          component as ComponentModule<ModalSubmitInteraction<"cached">>
        ).execute(
          client,
          interaction as ModalSubmitInteraction<"cached">,
          params
        );
        break;

      default:
        Logger.error(`Unknown component type for interaction: ${interaction}`);
        break;
    }
  } catch (err) {
    return Logger.error(
      `Error executing component with id: ${componentId}`,
      err
    );
  }
}

function getIds(interaction: Interaction) {
  let customId = "";
  let componentId = "";
  const params: Record<string, string> = {};

  if (
    interaction.isButton() ||
    interaction.isAnySelectMenu() ||
    interaction.isModalSubmit()
  ) {
    const [idPart, ...userParts] = interaction.customId.split("|");

    componentId = idPart;
    customId = interaction.customId;

    for (const part of userParts) {
      if (part.startsWith("<") && part.endsWith(">")) {
        const inner = part.slice(1, -1);
        const colonIndex = inner.indexOf(":");
        if (colonIndex !== -1) {
          const key = inner.slice(0, colonIndex);
          const value = inner.slice(colonIndex + 1);
          if (key && value) params[key] = value;
        }
      }
    }
  }

  return {
    componentId,
    customId,
    params,
  };
}

function getComponentType(interaction: Interaction): ComponentTypes {
  if (interaction.isButton()) return ComponentTypes.Button;
  else if (interaction.isAnySelectMenu()) return ComponentTypes.SelectMenu;
  else return ComponentTypes.Modal;
}
