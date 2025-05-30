import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../System/Types/Component.js";
import { Colors, Emojis } from "../../../config.js";

export default {
  id: "Scissors",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">, params) {
    const userID = params.UserID;

    if (button.member.id !== userID) {
      const member = await client.users.fetch(userID);

      await button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `${Emojis.Info} This menu is for ${member.displayName}, so you cannot use it.`
            ),
        ],
        ephemeral: true,
      });
    } else {
      const choices = ["Rock", "Paper", "Scissors"];

      const userChoice = button.customId.split("|")[0];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];

      let resultMessage = "It's a Tie!";

      if (
        (botChoice === "Rock" && userChoice === "Scissors") ||
        (botChoice === "Scissors" && userChoice === "Paper") ||
        (botChoice === "Paper" && userChoice === "Rock")
      ) {
        resultMessage = `Bot wins! ${botChoice} beats ${userChoice}!`;
      } else if (
        (userChoice === "Scissors" && botChoice === "Paper") ||
        (userChoice === "Rock" && botChoice === "Scissors") ||
        (userChoice === "Paper" && botChoice === "Rock")
      ) {
        resultMessage = `You win! ${userChoice} beats ${botChoice}!`;
      }

      const resultEmbed = new EmbedBuilder()
        .setTitle("Rock, Paper, Scissors - Shoot!")
        .addFields(
          { name: "Your Choice", value: `${Emojis[userChoice]}`, inline: true },
          { name: "Bot's Choice", value: `${Emojis[botChoice]}`, inline: true },
          { name: "Result", value: resultMessage, inline: false }
        )
        .setColor(Colors.Normal);

      await button.update({
        embeds: [resultEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`newGame|<UserID:${userID}>`)
              .setStyle(ButtonStyle.Secondary)
              .setLabel("New Game")
          ),
        ],
      });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;
