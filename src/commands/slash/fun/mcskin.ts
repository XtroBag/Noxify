import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import {
  RenderCrops,
  RenderTypes,
} from "../../../handler/types/StarlightSkinAPI";
import { getSkinRender } from "../../../handler/util/McSkinRender";
import { Colors } from "../../../config";

// Helper function to map RenderTypes to their allowed RenderCrops
const renderCropsForType = {
  [RenderTypes.Default]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Marching]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Walking]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Crouching]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Crossed]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.CrissCross]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Cheering]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Relaxing]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Trudging]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Cowering]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Pointing]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Lunging]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Dungeons]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Facepalm]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Sleeping]: [RenderCrops.Full, RenderCrops.Bust],
  [RenderTypes.Dead]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Archer]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Kicking]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Mojavatar]: [RenderCrops.Full, RenderCrops.Bust],
  [RenderTypes.Ultimate]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Isometric]: [
    RenderCrops.Full,
    RenderCrops.Bust,
    RenderCrops.Face,
  ],
  [RenderTypes.Head]: [RenderCrops.Full],
  [RenderTypes.Bitzel]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Pixel]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Skin]: [RenderCrops.Default, RenderCrops.Processed],

  // New render types
  [RenderTypes.HighGround]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Reading]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
  [RenderTypes.Profile]: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
};

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  disabled: false,
  ownerOnly: false,
  data: new SlashCommandBuilder()
    .setName("mcskin")
    .setDescription("Get some awesome Minecraft avatar pictures!")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Bedrock users need a . at the start of their names")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Choose a render type")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("crop")
        .setDescription("Choose a render crop")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  
  async execute({ client, interaction }) {
    const playerName = interaction.options.getString("name");
    const renderType = interaction.options.getString("type");
    const renderCrop = interaction.options.getString("crop");

    await interaction.deferReply();

    try {
      // Fetch the skin render as a Buffer
      const skinImageBuffer = await getSkinRender(
        renderType as RenderTypes,
        playerName,
        renderCrop as RenderCrops
      );

      // Send the skin render as an embed
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setImage("attachment://skin.png")
            .setColor(Colors.Normal)
            .setFooter({ text: 'Starlight Skin API', iconURL: 'https://cdn.discordapp.com/emojis/1190158024833249310.webp?size=128' })
        ],
        files: [
          {
            attachment: skinImageBuffer,
            name: "skin.png",
          },
        ],
      });
    } catch (error) {
      // Directly show the error message received from the getSkinRender function
      await interaction.editReply({
        content: `${error.message}`,
      });
    }
  },

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === "type") {
      // Filter render types based on input
      const choices = Object.values(RenderTypes)
        .filter((type) =>
          type.toLowerCase().includes(focusedOption.value.toLowerCase()) // Live filtering
        )
        .slice(0, 25) // Limit to top 25 choices
        .map((type) => ({ name: type, value: type }));
      await interaction.respond(choices);
    }

    if (focusedOption.name === "crop") {
      const renderType = interaction.options.getString("type");
      const allowedCrops = renderCropsForType[renderType as RenderTypes] || [];

      // Filter crops based on input and selected render type
      const filteredCrops = allowedCrops
        .filter((crop) =>
          crop.toLowerCase().includes(focusedOption.value.toLowerCase()) // Live filtering
        )
        .slice(0, 25) // Limit to top 25 choices
        .map((crop) => ({ name: crop, value: crop }));

      await interaction.respond(filteredCrops);
    }
  },
} as SlashCommandModule;
