import {
  ButtonInteraction,
  GuildMember,
  PermissionFlagsBits,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../handler/types/Component";

export = {
  id: "loggingBan",
  type: ComponentTypes.Button,
  async execute(
    client,
    button: ButtonInteraction<"cached">,
    extras
  ): Promise<any> {
    const userId = extras[0];

    /**
     * Might need to add checks for if the user is higher then the person clicking the ban <person> button and same for kick
     */

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
} as ComponentModule<ButtonInteraction<'cached'>>;
