import { Collection, EmbedBuilder, inlineCode } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler/types/Command";
import { Colors, formatCooldown } from "../../../config";

export = {
  name: "help",
  aliases: ["h", "helpme"],
  category: "general",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const cmdsearch = args[0];

    if (cmdsearch) {
      const command = client.commands.prefix.get(cmdsearch.toLowerCase());

      if (command) {
        const aliases =
          command.aliases.length > 0
            ? command.aliases.map((a) => inlineCode(a)).join("\n")
            : "None";

        const ownerOnly = command.ownerOnly ? "Yes" : "No";
        const disabled = command.disabled ? "Yes" : "No";
        const cooldown = formatCooldown(command.cooldown);

       const reply = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                `${command.name.charAt(0).toUpperCase()}${command.name
                  .slice(1)
                  .toLowerCase()} Command`
              )
              .setDescription(
                `Detailed information for the **${command.name}** command:`
              )
              .addFields(
                {
                  name: "Info:",
                  value: `Category: ${inlineCode(command.category)}\nAliases\n${aliases}`,
                  inline: true,
                },
                {
                  name: "Details:",
                  value: `Disabled: ${inlineCode(disabled)}\nOwnerOnly: ${inlineCode(ownerOnly)}\nCooldown: ${inlineCode(cooldown)}`,
                  inline: true,
                },
              )
              .setColor(Colors.Normal),
          ],
        });

      //  const response = await reply.fetchReference()
       client.replies.set(message.id, reply.id);

      } else {
        await message.reply({
          content: `No command found with the name **${cmdsearch}**. Please check the command name and try again.`,
        });
      }
    } else {
      const generalCommands = client.commands.prefix.filter(
        (cmd) => cmd.category === "general"
      );
      const usefulCommands = client.commands.prefix.filter(
        (cmd) => cmd.category === "useful"
      );
      const funCommands = client.commands.prefix.filter(
        (cmd) => cmd.category === "fun"
      )

      const formatCommands = (
        commands: Collection<string, PrefixCommandModule>
      ) => {
        const cmdArray = commands.map((cmd) => inlineCode(cmd.name));
        const chunkSize = 7; // Number of commands per line
        const chunks = [];

        for (let i = 0; i < cmdArray.length; i += chunkSize) {
          chunks.push(cmdArray.slice(i, i + chunkSize).join(" "));
        }

        return chunks.join("\n"); // Join chunks with newline to separate lines
      };

      const generalDescription = formatCommands(generalCommands);
      const usefulDescription = formatCommands(usefulCommands);
      const funDescription = formatCommands(funCommands);

      const reply = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Command List")
            .setDescription(
              `**General:**\n${generalDescription}\n**Useful:**\n${usefulDescription}\n**Fun:**\n${funDescription}`
            )
            .setFooter({ text: 'Use .help <cmd> to get more info' })
            .setColor(Colors.Normal),
        ],
      });

      client.replies.set(message.id, reply.id);
    }
  },
} as PrefixCommandModule;
