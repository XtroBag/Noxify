import {
  ChannelType,
  EmbedBuilder,
  Message,
  MessageReaction,
  User,
} from "discord.js";
import {
  CommandTypes,
  PrefixCommandModule,
} from "../../../handler/types/Command";
import { Colors, Emojis } from "../../../config";

export = {
  name: "rps",
  category: "fun",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    if (message.channel.type !== ChannelType.GuildText) return;

    const startGame = async (msg: Message) => {
      const embed = new EmbedBuilder()
        .setTitle("Let’s Play Rock, Paper, Scissors!")
        .setDescription(
          `React with:\n${Emojis.Rock} for Rock\n${Emojis.Paper} for Paper\n${Emojis.Scissors} for Scissors`
        )
        .setColor(Colors.Normal);

      await msg.edit({ embeds: [embed] });

      await msg.reactions.removeAll();
      await msg.react(Emojis.Rock);
      await msg.react(Emojis.Paper);
      await msg.react(Emojis.Scissors);

      const filter = (reaction: MessageReaction, user: User) => {
        return (
          ["Rock", "Paper", "Scissors"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      const choices = ["Rock", "Paper", "Scissors"];
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
            { name: "Your Choice", value: `${Emojis[userChoice]}` },
            { name: "Bot's Choice", value: `${Emojis[botChoice]}` }
          )
          .setColor(Colors.Normal);

        let resultMessage = "It's a Tie! 🌀";

        if (userChoice === botChoice) {
          resultMessage = "It's a Tie! 🌀";
        } else if (
          (botChoice === "Rock" && userChoice === "Scissors") ||
          (botChoice === "Scissors" && userChoice === "Paper") ||
          (botChoice === "Paper" && userChoice === "Rock")
        ) {
          if (botChoice === "Rock" && userChoice === "Scissors") {
            resultMessage = "Bot wins! Rock crushes Scissors! 🎺";
          } else if (botChoice === "Scissors" && userChoice === "Paper") {
            resultMessage = "Bot wins! Scissors cuts Paper! 🎺";
          } else if (botChoice === "Paper" && userChoice === "Rock") {
            resultMessage = "Bot wins! Paper covers Rock! 🎺";
          }
        } else {
          if (userChoice === "Rock" && botChoice === "Scissors") {
            resultMessage = "You win! Rock crushes Scissors! 🏅";
          } else if (userChoice === "Scissors" && botChoice === "Paper") {
            resultMessage = "You win! Scissors cuts Paper! 🏅";
          } else if (userChoice === "Paper" && botChoice === "Rock") {
            resultMessage = "You win! Paper covers Rock! 🏅";
          }
        }

        resultEmbed.addFields({ name: "Result", value: resultMessage });

        await msg.edit({ embeds: [resultEmbed] });

        await msg.react("✅");

        const playAgainFilter = (reaction: MessageReaction, user: User) => {
          return reaction.emoji.name === "✅" && user.id === message.author.id;
        };

        const playAgainCollected = await msg.awaitReactions({
          max: 1,
          time: 60000,
          filter: playAgainFilter,
          errors: ["time"],
        });

        if (playAgainCollected.size > 0) {
          startGame(msg);
        }
      } catch (error) {
        await msg.reactions.removeAll();
        await msg.edit({
          embeds: [new EmbedBuilder().setColor(Colors.Error).setDescription(`${Emojis.Cross} You took too long to respond. Please try to react faster.`)],
        });
      }
    };

    const embed = new EmbedBuilder()
      .setTitle("Let’s Play Rock, Paper, Scissors!")
      .setDescription(
        `React with:\n${Emojis.Rock} for Rock\n${Emojis.Paper} for Paper\n${Emojis.Scissors} for Scissors`
      )
      .setColor(Colors.Normal);

    let msg = await message.channel.send({ embeds: [embed] });

    startGame(msg);
  },
} as PrefixCommandModule;
