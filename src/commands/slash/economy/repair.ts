import { getEconomy } from "../../../handler/util/DatabaseCalls";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ActionRowBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Economy } from "../../../handler/schemas/models/Models";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("repair")
    .setDescription(
      "Server admins can use this command to repair a user's economy information."
    )
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription(
          "The member whose economy information you want to repair"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("The specific data you wish to repair")
        .setChoices([
          {
            name: "Bank Balance",
            value: "bankBalance",
          },
          {
            name: "Account Balance",
            value: "accountBalance",
          },
          {
            name: "Milestones",
            value: "milestones",
          },
          {
            name: "Transactions",
            value: "transactions",
          },
        ])
        .setRequired(true)
    ),
  async execute({ client, interaction }) {
    if (interaction.memberPermissions.has("Administrator")) {
      const member = interaction.options.getMember("member");
      const option = interaction.options.getString("option");

      if (member.user.bot)
        return await interaction.reply({
          content: "You cannot repair the economy data of a bot.",
          ephemeral: true,
        });

      const economy = await getEconomy({ guildID: interaction.guildId });
      if (!economy)
        return await interaction.reply({
          content: `This server doesn't have an economy system set up.`,
          ephemeral: true,
        });

      const user = economy.users.find((user) => user.userID === member.id);
      if (!user)
        return await interaction.reply({
          content: `The user does not have an account in the economy system.`,
          ephemeral: true,
        });

      if (user) {
        switch (option) {
          case "bankBalance":
            {
              const modal = new ModalBuilder()
                .setCustomId(`repair-bank-balance|${member.id}`)
                .setTitle("Update Bank Balance")
                .setComponents(
                  new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                    .setCustomId('repaired-bank-balance')
                    .setLabel('New Balance')
                    .setPlaceholder(`Please don't use comma's they are not allowed`)
                    .setMinLength(1)
                    .setMaxLength(10)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                  )
                );

              await interaction.showModal(modal);
            }
            break;
          case "accountBalance":
            {
              const modal = new ModalBuilder()
              .setCustomId(`repair-account-balance|${member.id}`)
              .setTitle("Update Account Balance")
              .setComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                  new TextInputBuilder()
                  .setCustomId('repaired-account-balance')
                  .setLabel('New Balance')
                  .setPlaceholder(`Please don't use comma's they are not allowed`)
                  .setMinLength(1)
                  .setMaxLength(10)
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
                )
              );

            await interaction.showModal(modal);
            }
            break;
          case "milestones":
            {
              await Economy.findOneAndUpdate(
                { guildID: interaction.guildId, "users.userID": member.id },
                { $set: { "users.$.milestones": [] } }
              );

              await interaction.reply({
                content: `The milestones for ${member.user.username} have been repaired (reset).`,
                ephemeral: true,
              });
            }
            break;
          case "transactions":
            {
              await Economy.findOneAndUpdate(
                { guildID: interaction.guildId, "users.userID": member.id },
                { $set: { "users.$.transactions": [] } }
              );

              await interaction.reply({
                content: `The transactions for ${member.user.username} have been repaired (reset).`,
                ephemeral: true,
              });
            }
            break;

          default:
            return await interaction.reply({
              content: "Unknown option selected.",
              ephemeral: true,
            });
        }
      }
    } else {
      return await interaction.reply({
        content: `You do not have administrator permissions to use this command.`,
      });
    }
  },
} as SlashCommandModule;
