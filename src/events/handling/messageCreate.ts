import { EventModule } from "../../handler/types/EventModule";
import { Events } from "discord.js";
import { handleMessageCommands } from "../../handler/util/HandleChatCommands";

export = {
  name: Events.MessageCreate,
  async execute({ client, args: [message] }) {
    if (message.author.bot) return;
    
    await handleMessageCommands(message);
  },
} as EventModule<"messageCreate">;
