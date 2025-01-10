import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ComponentType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("View the developers of this bot")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall
    ),
  async execute({ client, interaction }) {
    const defaultEmbed = new EmbedBuilder()
      .setTitle(`${Emojis.Noxify} Credits - Main Menu`)
      .setDescription(
        `These are the people who made Noxify! Select who you want to show a page for.`
      )
      .setColor(Colors.Normal);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId("credits-menu")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          {
            label: "XtroBag",
            value: "xtrobag",
            description: "Main Developer",
            emoji: Emojis.XtroBag,
          },
          {
            label: "BroBoiler",
            value: "broboiler",
            description: "Main Artist",
            emoji: Emojis.BroBoiler,
          },
        ])
    );

    const reply = await interaction.reply({
      embeds: [defaultEmbed],
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 180000,
    });

    collector.on("collect", async (menu) => {
      if (menu.customId === "credits-menu") {
        // Check the selected value and generate the appropriate embed
        let personEmbed: EmbedBuilder;

        if (menu.values[0] === "xtrobag") {
          personEmbed = new EmbedBuilder()
            .setTitle(`${Emojis.XtroBag} XtroBag - Main Developer`)
            .setDescription(
              `**XtroBag** is the main developer behind Noxify. They are responsible for the majority of the bot's backend development and features.`
            )
            .setColor(Colors.Normal);
        } else if (menu.values[0] === "broboiler") {
          personEmbed = new EmbedBuilder()
            .setTitle(`${Emojis.BroBoiler} BroBoiler - Main Artist`)
            .setDescription(
              `**BroBoiler** is the main artist of Noxify. They designed the bot's logo, artwork, and the overall visual theme.
             "Hello, I am BroBoiler, also known as Brody, I do art as well as music, I have been making art in 2018 and have been making art ever since!"`
            )
            .setColor(Colors.Normal);
        }

        // Update the message with the selected person's embed
        await menu.update({
          embeds: [personEmbed],
          components: [row], // Keep the select menu active so they can view the other person
        });
      }
    });

    collector.on("end", async () => {
      // You can disable the select menu after 3 minutes or when the collector ends
      await interaction.editReply({
        components: [],
      });
    });
  },
} as SlashCommandModule;
