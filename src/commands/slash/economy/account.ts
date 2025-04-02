import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  SlashCommandBuilder,
  userMention,
} from "discord.js";
import { Colors, Emojis, milestones } from "../../../config";
import { EconomyUser } from "../../../handler/types/economy/EconomyUser";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("account")
    .setDescription(
      "Check your personal banking information, such as the money in your bank account or in your wallet."
    )
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription(
          "Check other user's banking information, such as how much they have in their bank or in their wallet."
        )
    ),
  async execute({ client, interaction }) {
    const member =
      interaction.options.getMember("member") || interaction.member;

    if (member.user.bot) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} You cannot view the banking information of bots.`
            ),
        ],
        ephemeral: true,
      });
    }

    const economy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

    if (!economy) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `${Emojis.Info} This server does not have an Economy system set up currently.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    const userExists = economy.users.find((user) => user.userID === member.id);

    if (!userExists) {
      await client.utils.addUserToEconomy({
        guildID: interaction.guildId,
        userID: member.id,
        displayName: member.displayName,
        joined: new Date(),
        health: 100,
        bankingAccounts: {
          wallet: economy.defaultBalance,
          bank: 0,
        },
        privacyOptions: {
          receiveNotifications: true,
          viewInventory: false,
        },
        milestones: [],
        transactions: [],
        effects: [],
        inventory: { meals: [], weapons: [], drinks: [], ingredients: [], ammos: [] },
      });
    }

    const fetchedEconomy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

    const person = fetchedEconomy.users.find(
      (user) => user.userID === member.id
    );

    if (!person) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} An error occurred while retrieving the user's banking information.`
            ),
        ],
        ephemeral: true,
      });
    }

    const getTotalBalance = (user: EconomyUser): number =>
      user.bankingAccounts.wallet + user.bankingAccounts.bank;

    const leaderboard = fetchedEconomy.users.sort((a, b) => {
      const totalA = getTotalBalance(a);
      const totalB = getTotalBalance(b);
      return totalB - totalA;
    });

    const searchedUserIndex = leaderboard.findIndex(
      (user) => user.displayName === person.displayName
    );

    const rank = searchedUserIndex !== -1 ? searchedUserIndex + 1 : "Not found";

    const bankingInformation = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.username}'s Profile`,
        iconURL: member.displayAvatarURL({ extension: "png" }),
      })
      .setDescription(
        `${Emojis.Joined} Joined: ${person.joined.toDateString()}\n` +
        `${Emojis.Transactions} Transactions: ${inlineCode(person.transactions.length.toString())}\n` +
        `${Emojis.ActiveEffects} Active Effects: ${inlineCode(person.effects.length.toString())}\n` +
        `${Emojis.Leaderboard} Leaderboard Rank: ${inlineCode(`#${rank}`)}\n` + 
        `${Emojis.Health} Health: ${inlineCode(person.health.toString())}\n`
      )
      
      .setFields([
        {
          name: `${Emojis.Bank} **Bank**`,
          value: `${client.utils.formatNumber(
            person.bankingAccounts.bank
          )} ${economy.icon}`,
          inline: true,
        },
        {
          name: `${Emojis.Wallet} **Wallet**`,
          value: `${client.utils.formatNumber(
            person.bankingAccounts.wallet
          )} ${economy.icon}`,
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
    let currentMilestone = null;

    for (const milestoneAmount of milestones) {
      const milestoneReachedAlready = person.milestones.some(
        (milestone) =>
          milestone.amount === milestoneAmount && milestone.finished === true
      );

      if (
        person.bankingAccounts.bank + person.bankingAccounts.wallet >=
          milestoneAmount &&
        !milestoneReachedAlready
      ) {
        currentMilestone = milestoneAmount;

        await client.utils.addMilestoneToUser({
          guildID: interaction.guildId,
          userID: member.id,
          milestone: {
            amount: currentMilestone,
            finished: true,
            recieved: new Date().toDateString(),
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
      currentMilestone !== null &&
      person.privacyOptions.receiveNotifications
    ) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Congrats, you hit a new Milestone 🎉")
            .setDescription(
              `${userMention(
                person.userID
              )} you reached a milestone of **${client.utils.formatNumber(
                currentMilestone
              )}** ${economy.name.toLowerCase().replace(/s$/, "")}${
                currentMilestone !== 1 ||
                economy.name.toLowerCase().endsWith("s")
                  ? "s"
                  : ""
              }`
            ),
        ],
      });
    }
  },
} as SlashCommandModule;
