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
  import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
  import { Emojis, Colors } from "../../config";
  
  export = {
    id: "accountPrivacyOptions",
    type: ComponentTypes.SelectMenu,
    async execute(client, menu, extras): Promise<void> {
  
      const userId = extras[0];
      const economy = await client.utils.getEconomy({ guildID: menu.guildId });
      const person = economy.users.find((user) => user.userID === userId);
  
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

        await menu.deferUpdate();
        
          await client.utils.updatePrivacyOptions({ 
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
                emoji: Emojis.ViewInventory
              },
              {
                label: "Receive Notifications",
                value: "receiveNotifications",
                description: "Get Notifications of changes",
                emoji: Emojis.ReceiveNotifications
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

        const economy = await client.utils.getEconomy({ guildID: menu.guildId });
        const updatedPerson = economy.users.find((user) => user.userID === userId);
  
         await menu.editReply({
          components: [row, backbutton],
          embeds: [
            new EmbedBuilder()
              .setTitle("Edit Permissions")
              .setDescription(`${Emojis.ViewInventory} View Inventory ${
                updatedPerson.privacyOptions.viewInventory
                  ? Emojis.Check
                  : Emojis.Cross
              }\n${Emojis.ReceiveNotifications} Receive Notifications ${
                updatedPerson.privacyOptions.receiveNotifications
                    ? Emojis.Check
                    : Emojis.Cross
                }`
            )
              .setColor(Colors.Normal),
          ],
        });
      }
    },
  } as ComponentModule<StringSelectMenuInteraction<"cached">>;
  