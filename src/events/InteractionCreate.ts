import {
  Colors,
  ComponentType,
  EmbedBuilder,
  Events,
  MessageFlags,
} from "discord.js";
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
        await command.autocomplete({
          client: noxify,
          interaction: interaction,
        });
      } catch (error) {
        console.error(error);
      }
    }

    // make a dedicated handler for modal submissions & buttons and menus later.

    // if (interaction.isModalSubmit()) {
    //   if (interaction.customId === "version-modal") {
    //     const versionInput =
    //       interaction.fields.getTextInputValue("version-input");
    //     const loaderInput =
    //       interaction.fields.getStringSelectValues("loader-input");

    //     const loaders = loaderInput.values[0];

    //     const versions = await noxify.modrinth.getProjectVersions(
    //       "fabric-api",
    //       {
    //         loaders: loaders,
    //         game_versions: [versionInput],
    //         featured: false,
    //       }
    //     );

    //     await interaction.deferUpdate();

    //     // const versionList = versions
    //     //   .map((v) => {
    //     //     const date = new Date(v.date_published).toLocaleDateString();
    //     //     const downloads = v.downloads?.toLocaleString() || "0";

    //     //     // Map each file to a clickable link with the filename and mark primary file
    //     //     const filesList = v.files
    //     //       .map(
    //     //         (file) =>
    //     //           `> [${file.filename}](${file.url})${
    //     //             file.primary ? " (primary)" : ""
    //     //           }`
    //     //       )
    //     //       .join("\n");

    //     //     return [
    //     //       `**${v.name || v.version_number}**`,
    //     //       `> 📅 **Published:** ${date}`,
    //     //       `> ⬇️ **Downloads:** ${downloads}`,
    //     //       `> 📁 **Files:**\n${filesList}`,
    //     //     ].join("\n");
    //     //   })
    //     //   .join("\n\n");

    //     // await interaction.followUp({
    //     //   embeds: [
    //     //     new EmbedBuilder()
    //     //       .setColor(Colors.White)
    //     //       .setTitle(`Fabric API Versions (${versions.length} found)`)
    //     //       .setDescription(versionList || "No versions found.")
    //     //       .setFooter({ text: "Data fetched from Modrinth API" }),
    //     //   ],
    //     // });
    //   }
    // }
  }
);
