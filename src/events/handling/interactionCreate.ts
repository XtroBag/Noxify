import { EventModule } from "../../handler";
import { Events, Interaction } from "discord.js";
import { handleComponents } from "../../handler/util/handleComponents";
import { handleInteractionCommands } from "../../handler/util/handleInteractionCommands";

export = {
    name: Events.InteractionCreate,
    async execute(client, interaction: Interaction): Promise<void> {
        // Handles Slash Commands, Autocomplete Commands and Context Menus.
        if (
            interaction.isCommand()
            || interaction.isContextMenuCommand()
            || interaction.isAutocomplete()
        ) await handleInteractionCommands(client, interaction);


        // Handles Buttons, Select Menus and Modals.
        else if (
            interaction.isButton()
            || interaction.isAnySelectMenu()
            || interaction.isModalSubmit()
        ) await handleComponents(client, interaction);
    }
} as EventModule;