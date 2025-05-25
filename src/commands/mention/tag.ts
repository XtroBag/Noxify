import { CommandTypes, PingCommandModule } from "../../System/Types/Command.js";

export default {
    name: "help",
    type: CommandTypes.PingCommand,
    async execute({ client, message, args }) {
        await message.reply("How can I help you?");
    }
} as PingCommandModule;