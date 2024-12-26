import { EventModule } from "../handler";
import { Events, Message } from "discord.js";
import { handleMessageCommands } from "../handler/util/handleChatCommands";

export = {
  name: Events.MessageCreate,
  async execute(client, message: Message): Promise<void> {
    if (message.author.bot) return;

    const guild = await client.guilds.fetch("1262781532930572309");
    const channels = await guild.channels.fetch();

    const chat = channels.find(
      (channel) => channel.id === "1316963096278859856"
    );

    if (message.channelId === chat.id) {
      console.log(`Guild: ${message.guild.name} 
                   User: ${message.member.user.username}
                   Message: ${message.content}`);
    }

    await handleMessageCommands(message);
  },
} as EventModule;
