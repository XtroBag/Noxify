import { Message } from "discord.js";
import { CommandTypes, PingCommandModule } from "../../handler";

export = {
    name: "help",
    type: CommandTypes.PingCommand,
    async execute({ client, message, args }) {
        await message.reply("How can I help you?");
    }
} as PingCommandModule;