import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
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

  async autocomplete(interaction, client) {
    try {
      // Get the focused option
      const focusedOption = interaction.options.getFocused(true);
  
      // Get the value for the renderType option, if it exists
      const renderType = interaction.options.getString("type");
  
      // Handle autocompletion for the 'type' option
      if (focusedOption.name === "type") {
        const choices = Object.values(RenderTypes)
          .filter(
            (type) =>
              type.toLowerCase().includes(focusedOption.value.toLowerCase()) // Live filtering
          )
          .slice(0, 25)
          .map((type) => ({ name: type, value: type }));
  
        // Respond with the filtered choices
        await interaction.respond(choices);
      }
  
      // Handle autocompletion for the 'crop' option
      if (focusedOption.name === "crop") {
        // Ensure that renderType is valid and is of type RenderTypes
        if (!renderType || !Object.values(RenderTypes).includes(renderType as RenderTypes)) {
          return await interaction.respond([]); // If renderType is invalid, return no choices
        }
  
        const validCrops = getRenderTypeCrops(renderType as RenderTypes);
  
        // Ensure validCrops is an array
        const cropsArray = Array.isArray(validCrops) ? validCrops : [validCrops];
  
        const filteredCrops = cropsArray
          .filter((crop) =>
            crop.toLowerCase().includes(focusedOption.value.toLowerCase()) // Live filtering
          )
          .slice(0, 25)
          .map((crop) => ({ name: crop, value: crop }));
  
        // Respond with the filtered crops
        await interaction.respond(filteredCrops);
      }
    } catch (error) {
      console.error("Error in autocomplete:", error);
      // Optionally, you could send a message back to the user or log the error
      await interaction.respond([]);
    }
  }
  
} as SlashCommandModule;
