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
};

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Global,
    disabled: false,
    ownerOnly: false,
    data: new SlashCommandBuilder()
      .setName("mcskin")
      .setDescription(
        "Get some awesome minecraft avatar pictures!"
      )
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
          .addChoices(
            ...Object.values(RenderTypes).map((type) => ({
              name: type,
              value: type,
            }))
          )
      )
      // Remove addChoices for rendercrop, and handle autocomplete for it dynamically
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
        )
  
        // Send the skin render as an embed
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setImage("attachment://skin.png")
              .setColor(Colors.Normal)
          ],
          files: [
            {
              attachment: skinImageBuffer,
              name: "skin.png",
            },
          ],
        });
      } catch (error) {
        // Check if the error message contains 'Player not found' or a related error message
        if (error.message.includes("Player not found")) {
          await interaction.editReply({
            content: `The Minecraft player "${playerName}" could not be found. Please check the username and try again.`,
          });
        } else {
          await interaction.editReply({
            content: "Failed to fetch skin render. Please try again later.",
          });
        }
      }
    },
  
    // Autocomplete for render crop based on render type
    async autocomplete(interaction) {
      const renderType = interaction.options.getString("type");
      const allowedCrops = renderCropsForType[renderType as RenderTypes] || [];
      const focusedOption = interaction.options.getFocused(true);
  
      if (focusedOption.name === "crop") {
        // Filter crops based on the selected render type and match input
        const choices = allowedCrops
          .filter((crop) =>
            crop.toLowerCase().includes(focusedOption.value.toLowerCase())
          ) // Match input
          .slice(0, 25) // Limit to 25 options
          .map((crop) => ({ name: crop, value: crop }));
  
        await interaction.respond(choices);
      }
    },
  } as SlashCommandModule;