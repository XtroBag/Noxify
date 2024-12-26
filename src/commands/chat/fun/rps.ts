import { ChannelType, EmbedBuilder, MessageReaction, User } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler";
import { Colors } from "../../../config";

export = {
  name: "rps",
  aliases: [],
  category: "fun",
  disabled: false,
  ownerOnly: false,
  type: CommandTypes.PrefixCommand,
  async execute(client, message, args, db): Promise<void> {
    if (message.channel.type === ChannelType.GuildText) {
      // Create the initial embed with instructions
      const embed = new EmbedBuilder()
        .setTitle("Rock, Paper, Scissors")
        .setDescription("React to play\n\nReact with:\n🗻 for Rock\n✂ for Scissors\n📃 for Paper")
        .setColor(Colors.Normal)
        .setTimestamp();

      // Send the embed message and add reactions
      let msg = await message.channel.send({ embeds: [embed] });
      await msg.react("🗻");
      await msg.react("✂");
      await msg.react("📃");

      // Filter to check if the reaction is by the message author
      const filter = (reaction: MessageReaction, user: User) => {
        return ['🗻', '✂', '📃'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      // Bot's random choice (Rock, Paper, or Scissors)
      const choices = ['🗻', '✂', '📃'];

      // Track previous bot choice to ensure it's different from the last one
      let previousBotChoice: string | null = null;

      // Function to get the bot's choice, ensuring it's different from the last one
      function getBotChoice() {
        let botChoice;
        do {
          botChoice = choices[Math.floor(Math.random() * choices.length)];
        } while (botChoice === previousBotChoice); // If same as last, pick again
        previousBotChoice = botChoice; // Update previous bot choice
        return botChoice;
      }

      const botChoice = getBotChoice(); // Get the bot's choice with the new logic

      // Wait for the user's reaction
      try {
        const collected = await msg.awaitReactions({ max: 1, time: 60000, filter, errors: ["time"] });
        const reaction = collected.first();

        // Create result embed
        const resultEmbed = new EmbedBuilder()
          .setTitle("Result")
          .addFields(
            { name: "Your Choice", value: `${reaction.emoji.name}` },
            { name: "Bot's Choice", value: `${botChoice}` }
          )
          .setColor(Colors.Normal);

        await msg.edit({ embeds: [resultEmbed] });

        // Determine the outcome of the game
        let resultMessage;
        if ((botChoice === "🗻" && reaction.emoji.name === "✂") ||
          (botChoice === "✂" && reaction.emoji.name === "📃") ||
          (botChoice === "📃" && reaction.emoji.name === "🗻")) {
          resultMessage = "You lost!";
        } else if (botChoice === reaction.emoji.name) {
          resultMessage = "It's a tie.";
        } else {
          resultMessage = "You won!";
        }

        // Send the result message
        await message.channel.send({ content: resultMessage });

      } catch (error) {
        // If the user fails to respond in time
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("Game Cancelled")
          .setDescription("You failed to respond in time.")
          .setColor(Colors.Normal)
          .setTimestamp();

        await msg.reactions.removeAll();
        await msg.edit({ embeds: [timeoutEmbed] });
      }
    }
  },
} as PrefixCommandModule;
