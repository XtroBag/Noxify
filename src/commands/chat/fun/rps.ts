import { ChannelType, EmbedBuilder, MessageReaction, User } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler";
import { Colors } from "../../../config";

export = {
  name: "rps",
  category: "fun",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    if (message.channel.type !== ChannelType.GuildText) return;

    const embed = new EmbedBuilder()
      .setTitle("Rock, Paper, Scissors")
      .setDescription("React with:\n🪨 for Rock\n✂ for Scissors\n📃 for Paper")
      .setColor(Colors.Normal);

    let msg = await message.channel.send({ embeds: [embed] });
    await msg.react("🪨");
    await msg.react("✂");
    await msg.react("📃");

    const filter = (reaction: MessageReaction, user: User) => {
      return ['🪨', '✂', '📃'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const choices = ['🪨', '✂', '📃'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    try {
      const collected = await msg.awaitReactions({ max: 1, time: 60000, filter, errors: ["time"] });
      const userChoice = collected.first()?.emoji.name;

      if (!userChoice) return;

      const resultEmbed = new EmbedBuilder()
        .setTitle("Result")
        .addFields(
          { name: "Your Choice", value: userChoice },
          { name: "Bot's Choice", value: botChoice }
        )
        .setColor(Colors.Normal);

      let resultMessage = "It's a tie.";
      if ((botChoice === "🪨" && userChoice === "✂") ||
        (botChoice === "✂" && userChoice === "📃") ||
        (botChoice === "📃" && userChoice === "🪨")) {
        resultMessage = "You lost!";
      } else if (userChoice !== botChoice) {
        resultMessage = "You won!";
      }

      await msg.edit({ embeds: [resultEmbed] });
      await message.channel.send({ content: resultMessage });
    } catch (error) {
      await msg.edit({ content: "You took too long to respond.", embeds: [] });
    }
  },
} as PrefixCommandModule;
