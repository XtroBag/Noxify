import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler";

export = {
  name: "button",
  aliases: ["b"],
  category: "useful",
  ownerOnly: true,
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    await message.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("default-button|xtrobag|bsp2973|broboiler")
            .setLabel("Default")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  },
} as PrefixCommandModule;
