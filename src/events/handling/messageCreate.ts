import { EventModule } from "../../System/Types/EventModule.js";
import { Events } from "discord.js";
import { handleMessageCommands } from "../../System/Utils/Functions/Handlers/HandleChatCommands.js";
import { autoSlowmodeSystem } from "../../System/Utils/Functions/Other/AutoSlowmodeSystem.js";

export default {
  name: Events.MessageCreate,
  async execute({ client, args: [message] }) {
    if (message.author.bot) return;

    await handleMessageCommands(message);
    await autoSlowmodeSystem(message);

  },
} as EventModule<"messageCreate">;
