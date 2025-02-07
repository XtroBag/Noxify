import { inlineCode, ModalSubmitInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Economy } from "../../handler/schemas/models/Models";

export = {
  id: "repair-savings-balance",
  type: ComponentTypes.Modal,
  async execute(client, interaction, extras) {
    const userID = extras[0];

    let newBalance = interaction.fields.getTextInputValue(
      "repaired-savings-balance"
    );

    newBalance = newBalance.replace(/,/g, ""); // Remove commas
    newBalance = newBalance.replace(/[^\d]/g, ""); // Remove non-numeric characters

    if (newBalance === "" || isNaN(Number(newBalance))) {
      await interaction.reply({
        content:
          "Please enter a valid number for the bank balance without any invalid characters.",
        ephemeral: true,
      });
      return;
    }

    // Update logic here (save the new balance to the database or perform other actions)
    await Economy.findOneAndUpdate(
      { guildID: interaction.guildId, "users.userID": userID },
      { $set: { "users.$.bankingAccounts.savings": newBalance } }
    );

    await interaction.reply({
      content: `Bank balance updated to ${inlineCode(client.utils.formatNumber(Number(newBalance)))}`,
    });
  },
} as ComponentModule<ModalSubmitInteraction<"cached">>;
