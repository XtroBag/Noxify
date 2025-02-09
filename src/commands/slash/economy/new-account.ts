import {
    CommandTypes,
    RegisterTypes,
    SlashCommandModule,
  } from "../../../handler/types/Command";
  import {
    ApplicationIntegrationType,
    AttachmentBuilder,
    EmbedBuilder,
    InteractionContextType,
    SlashCommandBuilder,
  } from "discord.js";
  import { createCanvas, loadImage } from "canvas";
  import { Colors } from "../../../config";
  import axios from "axios";
  
  export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Global,
    ownerOnly: true,
    data: new SlashCommandBuilder()
      .setName("new-account")
      .setDescription("New account info viewer")
      .setContexts([InteractionContextType.Guild])
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("the user to search")
          .setRequired(true)
      ),
    async execute({ client, interaction }) {
      const member = interaction.options.getMember("member");
  
      await interaction.deferReply();
  
      const canvas = createCanvas(3000, 1860);
      const context = canvas.getContext("2d");
  
      const background = await loadImage("./src/images/Account-Background.png");
      context.drawImage(background, 0, 0);
  
      const avatarUrl = member.displayAvatarURL({ extension: 'png' });
      const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
      const body = Buffer.from(response.data);
  
      const avatar = await loadImage(body);
  
      const avatarSize = 500;
      const avatarX = 80;
      const avatarY = 80;
  
      // Draw circular avatar
      context.save();
      context.beginPath();
      context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      context.closePath();
      context.clip();
      context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      context.restore();
  
      // Display the user's main name
      const userName = member.user.globalName;
      const nameSpacing = 50;
  
      const textX = avatarX + avatarSize + nameSpacing;
      const textY = avatarY + avatarSize / 2 + 5;
  
      context.font = "bold 100px sans-serif";
      context.fillStyle = "#ffffff";
      context.fillText(userName, textX, textY);
  
      // Display the user's tag (with @ symbol) below the name
      const userTag = `@${member.user.username}`;
      const tagY = textY + 100 + 10; // Position it 10px below the display name
  
      context.font = "bold 60px sans-serif"; // Smaller font size for the tag
      context.fillStyle = "#ffffff";
      context.fillText(userTag, textX, tagY);
  
      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "account-image.png",
      });
  
      const embed = new EmbedBuilder().setColor(Colors.Normal).setImage("attachment://account-image.png");
  
      await interaction.editReply({ embeds: [embed], files: [attachment] });
    },
  } as SlashCommandModule;
  