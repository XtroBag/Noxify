import { inlineCode, ModalSubmitInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Economy } from "../../handler/schemas/models/Models";

export = {
  id: "repair-wallet-balance",
  type: ComponentTypes.Modal,
  async execute(client, interaction, params) {
    const userID = params.OrignalUserId;

    let newBalance = interaction.fields.getTextInputValue(
      "repaired-wallet-balance"
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
      { $set: { "users.$.bankingAccounts.wallet": newBalance } }
    );

    await interaction.reply({
      content: `Wallet balance updated to ${inlineCode(client.utils.formatNumber(Number(newBalance)))}`,
    });
  },
} as ComponentModule<ModalSubmitInteraction<"cached">>;
