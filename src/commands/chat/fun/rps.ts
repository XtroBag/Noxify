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
      .setTitle("Let’s Play Rock, Paper, Scissors!")
      .setDescription("React with:\n🪨 for Rock\n✂ for Scissors\n📃 for Paper")
      .setColor(Colors.Normal);

    let msg = await message.channel.send({ embeds: [embed] });
    await msg.react("🪨");
    await msg.react("✂");
    await msg.react("📃");

    const filter = (reaction: MessageReaction, user: User) => {
<<<<<<< HEAD
      return (
        ["🗻", "✂", "📃"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    const choices = ["🗻", "✂", "📃"];
=======
      return ['🪨', '✂', '📃'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const choices = ['🪨', '✂', '📃'];
>>>>>>> 29ad15eb6c1997e80977ddaa6896096e4ecb5002
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    try {
      const collected = await msg.awaitReactions({
        max: 1,
        time: 60000,
        filter,
        errors: ["time"],
      });
      const userChoice = collected.first()?.emoji.name;

      if (!userChoice) return;

      const resultEmbed = new EmbedBuilder()
        .setTitle("Shoot!")
        .addFields(
          { name: "Your Choice", value: userChoice },
          { name: "Bot's Choice", value: botChoice }
        )
        .setColor(Colors.Normal);

<<<<<<< HEAD
      let resultMessage = "It's a tie.";
      if (
        (botChoice === "🗻" && userChoice === "✂") ||
        (botChoice === "✂" && userChoice === "📃") ||
        (botChoice === "📃" && userChoice === "🗻")
      ) {
        resultMessage = "You lost!";
=======
      let resultMessage = "It's a Tie! 🌀";
      if ((botChoice === "🪨" && userChoice === "✂") ||
        (botChoice === "✂" && userChoice === "📃") ||
        (botChoice === "📃" && userChoice === "🪨")) {
        resultMessage = "You Lost! 🎺";
>>>>>>> 29ad15eb6c1997e80977ddaa6896096e4ecb5002
      } else if (userChoice !== botChoice) {
        resultMessage = "You Won! 🏅";
      }

      await msg.edit({ embeds: [resultEmbed] });
      await message.channel.send({ content: resultMessage });
    } catch (error) {
<<<<<<< HEAD
      (
        await msg.edit({ content: "You took too long to respond.", embeds: [] })
      ).reactions.removeAll();
=======
      await msg.edit({ content: "You took too long to respond. Please try to react to one of the options to play.", embeds: [] });
>>>>>>> 29ad15eb6c1997e80977ddaa6896096e4ecb5002
    }
  },
} as PrefixCommandModule;
