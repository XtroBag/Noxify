import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ApplicationIntegrationType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import {
  RenderCrops,
  RenderTypes,
} from "../../../handler/types/StarlightSkinAPI";
import {
  getRenderTypeCrops,
  getSkinRender,
} from "../../../handler/util/McSkinRender";
import { Colors } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  disabled: false,
  ownerOnly: false,
  data: new SlashCommandBuilder()
    .setName("mcskin")
    .setDescription("Get some awesome Minecraft avatar pictures!")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
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
      const skinImageBuffer = await getSkinRender(
        renderType as RenderTypes,
        playerName,
        renderCrop as RenderCrops
      );

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setImage("attachment://skin.png")
            .setColor(Colors.Normal)
            .setFooter({
              text: "Starlight Skin API",
              iconURL:
                "https://cdn.discordapp.com/emojis/1190158024833249310.webp?size=128",
            }),
        ],
        files: [
          {
            attachment: skinImageBuffer,
            name: "skin.png",
          },
        ],
      });
    } catch (error) {
      await interaction.editReply({
        content: `${error.message}`,
      });
    }
  },

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    const renderType = interaction.options.getString("type");

    if (focusedOption.name === "type") {
      const choices = Object.values(RenderTypes)
        .filter(
          (type) =>
            type.toLowerCase().includes(focusedOption.value.toLowerCase()) // Live filtering
        )
        .slice(0, 25)
        .map((type) => ({ name: type, value: type }));
      await interaction.respond(choices);
    }

    if (focusedOption.name === "crop") {
      const renderTypeOption = renderType as RenderTypes;

      const validCrops = getRenderTypeCrops(renderTypeOption);

      const cropsArray = Array.isArray(validCrops) ? validCrops : [validCrops];

      const filteredCrops = cropsArray
        .filter((crop) =>
          crop.toLowerCase().includes(focusedOption.value.toLowerCase())
        )
        .slice(0, 25)
        .map((crop) => ({ name: crop, value: crop }));

      await interaction.respond(filteredCrops);
    }
  },
} as SlashCommandModule;
