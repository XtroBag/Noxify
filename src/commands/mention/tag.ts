import { CommandTypes, PingCommandModule } from "../../handler/types/Command";

export = {
    name: "help",
    type: CommandTypes.PingCommand,
    async execute({ client, message, args }) {
        await message.reply("How can I help you?");
    }
} as PingCommandModule;