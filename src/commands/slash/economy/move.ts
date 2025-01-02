import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Colors } from "../../../config";
import { Economy } from "../../../handler/schemas/models/Models";
import { getEconomy } from "../../../handler/util/DatabaseCalls";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Swap your account data with another account")
    .addUserOption((data) =>
      data
        .setName("to")
        .setDescription("The member to swap your account data with")
        .setRequired(true)
    ),

  async execute({ client, interaction }) {
    const member = interaction.options.getMember("to");

    // Ensure member is a valid server member
    if (!member || member.user.bot) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription("You cannot swap data with a bot account or a non-server member."),
        ],
        ephemeral: true,
      });
      return;
    }

    // Ensure the member is not the same user
    if (interaction.user.id === member.id) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription("You cannot swap data with your own account."),
        ],
        ephemeral: true,
      });
      return;
    }

    // Retrieve the economy data for both users
    const economy = await getEconomy({ guildID: interaction.guildId });
    if (!economy) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription("This server doesn't have an economy system set up."),
        ],
        ephemeral: true,
      });
      return;
    }

    // Find the user whose data is being moved (the original user)
    const fromUser = economy.users.find((user) => user.userID === interaction.user.id);
    if (!fromUser) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription("You do not have an account in the economy system."),
        ],
        ephemeral: true,
      });
      return;
    }

    // Find the user who will receive the data (the target user)
    const toUser = economy.users.find((user) => user.userID === member.id);
    if (!toUser) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`${member.user.username} does not have an account in the economy system.`),
        ],
        ephemeral: true,
      });
      return;
    }

    // Create confirmation embed
    const confirmationEmbed = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setTitle("Confirm Account Swap")
      .setDescription(
        `You are about to swap your account data with **${member.user.username}**. The following data will be swapped:\n\n` +
        `- **Bank Balance**: Your bank balance will be swapped.\n` +
        `- **Account Balance**: Your account balance will be swapped.\n` +
        `- **Milestones**: Your milestones will be swapped.\n` +
        `- **Transactions**: Your transaction history will be swapped.\n\n` +
        "Please confirm if you'd like to proceed with this move. This action cannot be undone!"
      );

    // Create the confirmation buttons
    const confirmButton = new ButtonBuilder()
      .setCustomId(`accept-swap|${fromUser.userID}|${toUser.userID}`)
      .setLabel("Accept")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton);

    // Send the confirmation message
    await interaction.reply({
      embeds: [confirmationEmbed],
      components: [row],
      ephemeral: true,
    });
  },
} as SlashCommandModule;
