import { Events, MessageFlags } from "discord.js";
import Event from "../types/Event";

export default new Event(
  Events.InteractionCreate,
  { once: false, enabled: true },
  async (noxify, interaction) => {

    if (interaction.isChatInputCommand()) {
      const command = noxify.commands.get(interaction.commandName);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }
      try {
        const allowed = ["149621801989701633"];

        // Fetch usernames for allowed users
        const allowedUsernames: string[] = [];
        for (const id of allowed) {
          const user = await noxify.users.fetch(id);
          allowedUsernames.push(user.username);
        }

        // Check devonly option in command data
        const devOnly = command.options.developerOnly ?? false;

        if (devOnly) {
          if (!allowed.includes(interaction.user.id)) {
            await interaction.reply({
              content: `This command can only be used by: **${allowedUsernames.join(
                ", "
              )}**`,
              flags: MessageFlags.Ephemeral,
            });
            return;
          }
        }

        await command.execute({ client: noxify, interaction: interaction });
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }


    if (interaction.isAutocomplete()) {
      const command = noxify.commands.get(interaction.commandName);
      if (!command || !command.autocomplete) {
        console.error(
          `No command matching ${interaction.commandName} was found for autocomplete.`
        );
        return;
      }
      try {
        await command.autocomplete({ client: noxify, interaction: interaction });
      } catch (error) {
        console.error(error);
      } 
    }
  }
);
