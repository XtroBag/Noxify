import { EventModule } from "../../handler/types/EventModule";
import { Events } from "discord.js";
import { handleComponents } from "../../handler/util/handleComponents";
import { handleInteractionCommands } from "../../handler/util/handleInteractionCommands";

export = {
  name: Events.InteractionCreate,
  async execute({ client, args: [interaction] }) {
    if (
      interaction.isCommand() ||
      interaction.isContextMenuCommand() ||
      interaction.isAutocomplete()
    )
      await handleInteractionCommands(client, interaction);
    else if (
      interaction.isButton() ||
      interaction.isAnySelectMenu() ||
      interaction.isModalSubmit()
    )
      await handleComponents(client, interaction);
  },
} as EventModule<"interactionCreate">;
