import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  userMention,
} from "discord.js";
import { Colors, milestones } from "../../../config";
import {
  formatAmount,
  addEconomyUser,
  getEconomy,
  updateUserMilestones,
  isEmojiFormatValid,
} from "../../../handler/util/DatabaseCalls";
import { format, parse } from "date-fns";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("account")
    .setDescription(
      "Check your personal banking information, such as the money in your bank account or in your wallet."
    )
    .setContexts([InteractionContextType.Guild])
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription(
          "Check other user's banking information, such as how much they have in their bank or in their wallet."
        )
    ),
  async execute({ client, interaction }) {
    const member = interaction.options.getMember("member");

    if (!member) return await interaction.reply({ content: `Please pick a member that is inside this server`, ephemeral: true });

    if (member.user.bot) {
      await interaction.reply({
        content: "You cannot view the banking information of bots.",
        ephemeral: true,
      });
      return;
    }

    const economy = await getEconomy({ guildID: interaction.guildId });

    if (!economy) {
      await interaction.reply({
        content: "This server does not have an Economy system set up yet.",
        ephemeral: true,
      });
      return;
    }

    const exists = economy.users.find((user) => user.userID === member.id);

    if (!exists) {
      await addEconomyUser({
        guildID: interaction.guildId,
        userID: member.id,
        displayName: member.displayName,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        accountBalance: economy.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: false, viewInventory: false },
        milestones: [],
        transactions: [],
      });
    }

    const updatedEconomy = await getEconomy({ guildID: interaction.guildId });

    const person = updatedEconomy.users.find(
      (user) => user.userID === member.id
    );

    if (!person) {
      await interaction.reply({
        content:
          "An error occurred while retrieving the user's banking information.",
        ephemeral: true,
      });
      return;
    }

    const parsedDate = parse(
      person.joined,
      "EEEE, MMMM d, yyyy 'at' h:mm a",
      new Date()
    );
    const timestampInSeconds = Math.floor(parsedDate.getTime() / 1000);
    const discordTimestamp = `<t:${timestampInSeconds}:D>`;

    const bankBalanceFormatted = isEmojiFormatValid(economy.icon)
      ? `${economy.icon} ${formatAmount(person.bankBalance)}`
      : `${economy.icon}${formatAmount(person.bankBalance)}`;

    const walletBalanceFormatted = isEmojiFormatValid(economy.icon)
      ? `${economy.icon} ${formatAmount(person.accountBalance)}`
      : `${economy.icon}${formatAmount(person.accountBalance)}`;

    const bankingInformation = new EmbedBuilder()
      .setDescription(
        `Joined: ${discordTimestamp}\nTransactions: ${person.transactions.length}`
      )
      .setAuthor({
        name: member.user.username,
        iconURL: member.displayAvatarURL({ extension: "png" }),
      })
      .setFields([
        {
          name: "Bank",
          value: bankBalanceFormatted,
          inline: true,
        },
        {
          name: "Wallet",
          value: walletBalanceFormatted,
          inline: true,
        },
      ])
      .setColor(Colors.Normal);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accountRefresh|${member.id}`)
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`accountInventory|${member.id}`)
        .setLabel("Inventory")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`accountPrivacy|${member.id}`)
        .setLabel("Privacy")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.deferReply();

    let milestoneReached = false;
    let milestone = null;

    for (const m of milestones) {
      const milestoneReachedAlready = person.milestones.some(
        (milestone) => milestone.amount === m && milestone.finished === true
      );

      if (
        person.bankBalance + person.accountBalance >= m &&
        !milestoneReachedAlready
      ) {
        milestone = m;

        await updateUserMilestones({
          guildID: interaction.guildId,
          userID: member.id,
          milestone: {
            amount: m,
            finished: true,
            reachedAt: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
          },
        });

        milestoneReached = true;
        break;
      }
    }

    await interaction.editReply({
      embeds: [bankingInformation],
      components: [row],
    });

    if (
      milestoneReached &&
      milestone !== null &&
      person.privacySettings.receiveNotifications
    ) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Congrats, you hit a new Milestone 🎉")
            .setDescription(
              `${userMention(
                person.userID
              )} you reached a milestone of **${formatAmount(
                milestone
              )}** ${economy.name.toLowerCase().replace(/s$/, "")}${
                milestone !== 1 || economy.name.toLowerCase().endsWith("s")
                  ? "s"
                  : ""
              }`
            ),
        ],
      });
    }
  },
} as SlashCommandModule;
