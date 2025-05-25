import {
  ButtonInteraction,
  GuildMember,
  PermissionFlagsBits,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../System/Types/Component.js";

export default {
  id: "loggingKick",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">, params): Promise<any> {
    const userId = params.loggedUserId;

    await button.deferUpdate();

    if (!userId) {
      return button.followUp({
        content: "The user could not be found.",
        ephemeral: true,
      });
    }

    const member = button.member as GuildMember;

    if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return button.followUp({
        content: "You do not have permission to kick members.",
        ephemeral: true,
      });
    }

    if (
      !button.guild.members.me?.permissions.has(PermissionFlagsBits.KickMembers)
    ) {
      return button.followUp({
        content: "I do not have permission to kick members.",
        ephemeral: true,
      });
    }

    try {
      await member.guild.members.kick(
        userId,
        "Kicked via logging button interaction"
      );
      await button.followUp({
        content: `${userMention(userId)} has been kicked successfully.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return button.followUp({
        content: "An error occurred while trying to kick the member.",
      });
    }
  },
} as ComponentModule<ButtonInteraction<'cached'>>;
