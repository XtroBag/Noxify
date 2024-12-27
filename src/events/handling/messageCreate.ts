import { EventModule } from "../../handler";
import { Events, Message } from "discord.js";
import { handleMessageCommands } from "../../handler/util/handleChatCommands";

export = {
  name: Events.MessageCreate,
  async execute(client, message: Message): Promise<void> {
    if (message.author.bot) return;

    await handleMessageCommands(message);
  },
} as EventModule;
