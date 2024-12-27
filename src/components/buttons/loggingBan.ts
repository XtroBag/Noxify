import {
  ButtonInteraction,
  GuildMember,
  PermissionFlagsBits,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
  id: "loggingBan",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">): Promise<any> {
    const userId = button.customId.split("-")[1];

    await button.deferUpdate();

    if (!userId) {
      return button.followUp({
        content: "The user could not be found.",
        ephemeral: true,
      });
    }

    const member = button.member as GuildMember;

    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return button.followUp({
        content: "You do not have permission to ban members.",
        ephemeral: true,
      });
    }

    if (
      !button.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)
    ) {
      return button.followUp({
        content: "I do not have permission to ban members.",
        ephemeral: true,
      });
    }

    try {
      await member.guild.members.ban(userId, {
        reason: "Banned via logging button interaction",
      });
      await button.followUp({
        content: `${userMention(userId)} has been banned successfully.`,
        ephemeral: true,
      });
    } catch (error) {
      // If there is an error during the banning process
      console.error(error);
      return button.followUp({
        content: "An error occurred while trying to ban the member.",
      });
    }
  },
} as ComponentModule;
