import {
    CommandTypes,
    RegisterTypes,
    SlashCommandModule,
  } from "../../../handler";
  import {
    ApplicationIntegrationType,
    InteractionContextType,
    SlashCommandBuilder,
  } from "discord.js";
  import { getEconomy } from "../../../handler/util/DatabaseCalls";
  
  export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Global,
    data: new SlashCommandBuilder()
      .setName("weapon")
      .setDescription("Manage and use the weapons in your inventory to battle players.")
      .setContexts([InteractionContextType.Guild])
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("use")
          .setDescription("Select a weapon from your inventory to battle with.")
          .addStringOption((option) =>
            option
              .setName("item")
              .setDescription("Choose the weapon you wish to use in battle.")
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("Select the target user you want to attack.")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("equip")
          .setDescription("Equip a weapon to prepare for battle.")
          .addStringOption((option) =>
            option
              .setName("item")
              .setDescription("Choose the weapon you want to equip.")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("refill")
          .setDescription("Refill the ammo for your weapon.")
          .addStringOption((option) =>
            option
              .setName("ammo")
              .setDescription("Select the type of ammo you want to refill your weapon with.")
              .setRequired(true)
              .setAutocomplete(true)
          )
      ),
    async execute({ client, interaction }) {


      const economy = await getEconomy({ guildID: interaction.guildId });
  
      if (!economy) {
        await interaction.reply({
          content: "This server does not have an Economy system set up yet.",
          ephemeral: true,
        });
        return;
      }
  
      const user = economy.users.find(
        (user) => user.userID === interaction.member.id
      );


      /**
       * Make this system have a currentWeapon field on EconomyUser data in database and set it to whatever item they pick with this.
       * Also there is also some checks i'll prob need to do for errors and others. Also make it so only items from their inventory as "weapon" type can be used and listed for autocomplete.
       * Make a 'ammoTypeRequired' type field on weapons (files) to define what ammo they use if it's a weapon that does require ammo set the field in db to blank or something.
       */
  
      // Further logic for handling the commands (use, equip, refill) goes here.
    },
    async autocomplete(interaction, client) {
        

    },
  } as SlashCommandModule;
  