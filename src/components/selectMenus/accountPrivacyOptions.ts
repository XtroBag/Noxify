import {
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    StringSelectMenuInteraction,
  } from "discord.js";
  import { ComponentModule, ComponentTypes } from "../../handler";
  import {
    getEconomy,
    updateUserPermissions,
  } from "../../handler/util/DatabaseCalls";
  import { Emojis, Colors } from "../../config";
  
  export = {
    id: "accountPrivacyOptions",
    type: ComponentTypes.SelectMenu,
    async execute(client, menu: StringSelectMenuInteraction<"cached">, extras): Promise<void> {
  
      // Extract userID from customId
      const userId = extras[0];
      const economy = await getEconomy({ guildID: menu.guildId });
      const person = economy.users.find((user) => user.userID === userId);
  
      // Ensure the member ID matches the userID for permissions
      if (menu.member.id !== person.userID) {
         menu.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `You're not able to use this menu, it's ${person.displayName}'s`
              ),
          ],
          ephemeral: true,
        });
      } else {
        // Defer the update immediately
        await menu.deferUpdate();
        
          await updateUserPermissions({ 
            guildID: menu.guildId,
            userID: person.userID,
            selectedPermissions: menu.values
          })
  
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`accountPrivacyOptions|${userId}`)
            .setPlaceholder("Select permissions to enable")
            .setOptions([
              {
                label: "View Inventory",
                value: "viewInventory",
                description: "Allow users to check your inventory",
              },
              {
                label: "Receive Notifications",
                value: "receiveNotifications",
                description: "Get Notifications of changes",
              },
            ])
            .setMaxValues(2)
        );
  
        const backbutton = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId(`accountBack|${userId}`)
            .setLabel("Back")
            .setStyle(ButtonStyle.Secondary)
        );

        const economy = await getEconomy({ guildID: menu.guildId });
        const updatedPerson = economy.users.find((user) => user.userID === userId);
  
        // Create reply with embedded data and select menu
         await menu.editReply({
          components: [row, backbutton],
          embeds: [
            new EmbedBuilder()
              .setTitle("Edit Permissions")
              .setDescription(`View Inventory ${
                updatedPerson.privacySettings.viewInventory
                  ? Emojis.Check
                  : Emojis.Cross
              }\nReceive Notifications ${
                updatedPerson.privacySettings.receiveNotifications
                    ? Emojis.Check
                    : Emojis.Cross
                }`
            )
              .setColor(Colors.Normal),
          ],
        });
      }
    },
  } as ComponentModule;
  