import {
  bold,
  EmbedBuilder,
  ModalSubmitInteraction,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Colors, Emojis } from "../../config";
import ms from "ms";

export = {
  id: "SlowmodeTimesModal",
  type: ComponentTypes.Modal,
  async execute(client, modal, params) {
    const MAX_SLOWMODE_TIME = 21600; // 6 hours in seconds

    const orignalUser = params.Id;

    if (orignalUser !== modal.member.id) {
      return await modal.reply({
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

    const parseTime = (input: string, fieldName: string) => {
      let timeInMs;

      if (/^\d+$/.test(input)) {
        timeInMs = parseInt(input) * 1000;
      } else {
        timeInMs = ms(input);
      }

      if (!timeInMs || timeInMs < 1000) {
        throw new Error(
          `Invalid input for ${fieldName}. Use a valid time format ("10s", "5m", "2h").`
        );
      }

      if (timeInMs / 1000 > MAX_SLOWMODE_TIME) {
        throw new Error(`${fieldName} cannot be longer than 6 hours.`);
      }

      return timeInMs / 1000;
    };

    try {
      const shortestTime = parseTime(
        modal.fields.getTextInputValue("shortestTime"),
        bold("Shortest Time")
      );
      const moderateTime = parseTime(
        modal.fields.getTextInputValue("moderateTime"),
        bold("Moderate Time")
      );
      const highestTime = parseTime(
        modal.fields.getTextInputValue("highestTime"),
        bold("Highest Time")
      );

      await client.utils.autoSlowmodeSetTimes({
        guildID: modal.guildId,
        shortest: shortestTime,
        moderate: moderateTime,
        highest: highestTime,
      });

      await modal.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Success)
            .setDescription(
              `${Emojis.Check} Slowmode times updated successfully!`
            ),
        ],
        ephemeral: true,
      });
    } catch (error) {
      await modal.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`${Emojis.Cross} ${error.message}`),
        ],
        ephemeral: true,
      });
    }
  },
} as ComponentModule<ModalSubmitInteraction<"cached">>;
