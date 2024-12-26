import { Message } from "discord.js";
import { CommandTypes, MessageCommandModule } from "../../handler";

export = {
  name: "Hello",
  type: CommandTypes.MessageCommand,
  disabled: false,
  ownerOnly: false,
  async execute(client, message: Message): Promise<void> {
    await message.reply(`Hello <@${message.author.id}>`);
    }
} as MessageCommandModule;