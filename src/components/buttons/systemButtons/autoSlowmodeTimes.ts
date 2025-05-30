import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  userMention,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../System/Types/Component.js";
import { Colors } from "../../../config.js";

export default {
  id: "AutoSlowmodeTimes",
  type: ComponentTypes.Button,
  async execute(client, button, params) {
    const orignalUser = params.Id;
  
    if (orignalUser !== button.member.id) {
      return await button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `This menu is exclusively available for ${userMention(
                orignalUser
              )} only.`
            ),
        ],
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setTitle("Slowmode Cooldown Times")
      .setCustomId(`SlowmodeTimesModal|<Id:${orignalUser}>`);

    const shortestTimeInput = new TextInputBuilder()
      .setCustomId("shortestTime")
      .setLabel("Shortest Time")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const moderateTimeInput = new TextInputBuilder()
      .setCustomId("moderateTime")
      .setLabel("Moderate Time")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const highestTimeInput = new TextInputBuilder()
      .setCustomId("highestTime")
      .setLabel("Highest Time")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(shortestTimeInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(moderateTimeInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(highestTimeInput)
    );

    await button.showModal(modal);
  },
} as ComponentModule<ButtonInteraction<"cached">>;
