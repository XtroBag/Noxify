import { EventModule } from "../../System/Types/EventModule";
import { Events } from "discord.js";
import { handleComponents } from "../../System/Utils/Functions/Handlers/handleComponents.js";
import { handleInteractionCommands } from "../../System/Utils/Functions/Handlers/handleInteractionCommands.js";

export default {
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
