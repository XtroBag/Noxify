import { Colors, validCurrencySymbols } from "../../../config";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import {
  getEconomy,
  createEconomy,
  isServerEmojiValid,
} from "../../../handler/util/DatabaseCalls";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("economy")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Choose an action to perform for the economy system")
        .setChoices([
          { name: "Setup", value: "setup" },
          { name: "Delete", value: "delete" },
          { name: "View", value: "view" },
        ])
        .setRequired(true)
    )
    .setDescription("Setup an economy for the server"),
  async execute({ client, interaction }) {
    const action = interaction.options.getString("action");

    // NEED TO DO:
    // Make sure nobody can pass in any symbols or icons when asking for default starting price.
    // Like to make sure the bots role is high enough or smth.

    if (action === "setup") {
      if (!interaction.member.permissions.has("ManageGuild")) {
        await interaction.reply({
          content: "You do not have permission to setup this system.",
          ephemeral: true,
        });
        return;
      }

      const doc = await getEconomy({ guildID: interaction.guildId });

      if (doc) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("You already have the system setup.")
              .setColor(Colors.Normal),
          ],
        });
      } else {
        const questions = [
          {
            embed: new EmbedBuilder()
              .setDescription(
                "Input the name for the Economy type.\n-# For example, coins, gems, dollars, etc."
              )
              .setColor(Colors.Normal),
            field: "name",
          },
          {
            embed: new EmbedBuilder()
              .setDescription(
                "Input an emoji or currency symbol for the Economy icon.\n-# You can use a currency symbol like $, €, ¥ or any emoji."
              )
              .setColor(Colors.Normal),
            field: "icon",
          },
          {
            embed: new EmbedBuilder()
              .setDescription(
                "Input the default amount of currency for all users.\n-# This is the starting balance for all users."
              )
              .setColor(Colors.Normal),
            field: "defaultBalance",
          },
        ];

        let responses = new Map();
        let currentQuestionIndex = 0;

        const filter = (m) => m.author.id === interaction.user.id;
        const start = await interaction.reply({
          embeds: [questions[currentQuestionIndex].embed],
          fetchReply: true,
        });

        const collector = start.channel.createMessageCollector({ filter });

        collector.on("collect", async (message) => {
          const question = questions[currentQuestionIndex];
          responses.set(question.field, message.content);

          if (question.field === "defaultBalance") {
            const defaultBalance = parseInt(message.content);

            if (isNaN(defaultBalance) || defaultBalance < 0) {
              await interaction.followUp({
                content:
                  "Invalid number for default balance. Please enter a valid positive number.",
                ephemeral: true,
              });
              return;
            }
          }

          if (question.field === "icon") {
            const icon = message.content;

            if (
              !isServerEmojiValid(icon, interaction) &&
              !validCurrencySymbols.includes(icon)
            ) {
              await interaction.followUp({
                content:
                  "Invalid Type. Please use a valid emoji from this server or a standard currency symbol like $, €, ¥, etc.",
                ephemeral: true,
              });
              return;
            }
          }

          currentQuestionIndex++;

          if (currentQuestionIndex < questions.length) {
            await start.channel.send({
              embeds: [questions[currentQuestionIndex].embed],
            });
          } else {
            collector.stop("answered");
          }
        });

        collector.on("end", async (collected, reason) => {
          if (reason === "answered") {
            const reviewDescription = questions
              .map((question) => {
                const response = responses.get(question.field);
                return `${question.embed.data.description}\n➜ ${response}`;
              })
              .join("\n\n");

            const confirmButtonRow =
              new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                  .setCustomId("confirm-button")
                  .setLabel("Confirm")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("cancel-button")
                  .setLabel("Cancel")
                  .setStyle(ButtonStyle.Danger)
              );

            const response = await interaction.followUp({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Review your choices.")
                  .setDescription(reviewDescription)
                  .setColor(Colors.Normal)
                  .setFooter({
                    text: "Click Cancel to redo your choices",
                  }),
              ],
              components: [confirmButtonRow],
              ephemeral: true,
            });

            const buttonCollector = response.createMessageComponentCollector({
              componentType: ComponentType.Button,
            });

            buttonCollector.on("collect", async (button) => {
              if (button.customId === "confirm-button") {
                const economyName = responses.get("name");
                const economyIcon = responses.get("icon");
                const defaultBalance = parseInt(
                  responses.get("defaultBalance")
                );

                createEconomy({
                  guildID: interaction.guildId,
                  name: economyName,
                  icon: economyIcon,
                  defaultBalance: defaultBalance,
                  users: [],
                });

                button.update({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription(
                        "Your economy setup has been saved successfully."
                      )
                      .setColor(Colors.Normal),
                  ],
                  components: [],
                });
                buttonCollector.stop();
              } else if (button.customId === "cancel-button") {
                await button.update({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("Operation cancelled.")
                      .setColor(Colors.Normal),
                  ],
                  components: [],
                });
                buttonCollector.stop();
              }
            });
          }
        });
      }
    }

    if (action === "delete") {
      await interaction.reply({ content: "Not setup yet please wait." });
    }
  },
} as SlashCommandModule;
