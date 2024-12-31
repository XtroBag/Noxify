import { glob } from "glob";
import Logger from "./Logger";
import { Interaction, ButtonInteraction } from "discord.js";
import { DiscordClient } from "./DiscordClient";
import { componentsFolderName } from "../../config";
import { ComponentModule, ComponentTypes } from "../types/Component";

export async function registerComponents(client: DiscordClient): Promise<void> {
    const componentPaths: string[] = await glob(`**/${componentsFolderName}/**/**/*.js`);

    for (const componentPath of componentPaths) {
        const importPath: string = `../..${componentPath.replace(/^dist[\\\/]|\\/g, "/")}`;
        try {
            const module: ComponentModule = (await import(importPath)).default;
            const { id, group, type } = module;

            if (id || group) {
                if (Array.isArray(id)) {
                    client.components[type].set(group!, { ...module });
                } else {
                    client.components[type].set(id || group!, module);
                }
            }
        } catch (err) {
            Logger.error(`Failed to load component at ${importPath}`, err);
        }
    }
}

export async function handleComponents(client: DiscordClient, interaction: Interaction): Promise<void> {
    const { componentId, customId, extras } = getIds(interaction);
    if (interaction.isButton() || interaction.isAnySelectMenu()) interaction.customId = customId;

    if (!componentId) {
        return Logger.error("The component id could not be filtered.", interaction);
    }

    const component: ComponentModule | undefined = client.components[getComponentType(interaction)].get(componentId);

    const errorIdMessage = `group=${componentId === customId ? "none" : componentId} id:${customId}`;

    if (!component) return;

    if (interaction.isModalSubmit() && component.group) {
        return Logger.error(`The parameter group in ${errorIdMessage} is not allowed.`);
    }

    try {
        await component.execute(client, interaction, extras);
    } catch (err) {
        return Logger.error(`Error executing component with id: ${errorIdMessage}`, err);
    }
}


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
        componentId = interaction.customId;
        customId = interaction.customId;
    }

    return {
        componentId,
        customId,
        extras
    };
}




function getComponentType(interaction: Interaction): ComponentTypes {
    if (interaction.isButton()) return ComponentTypes.Button;
    else if (interaction.isAnySelectMenu()) return ComponentTypes.SelectMenu;
    else return ComponentTypes.Modal;
}
