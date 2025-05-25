import { CommandTypes, MessageCommandModule } from "../../System/Types/Command.js";

export default {
  name: "Hello There",
  type: CommandTypes.MessageCommand,
  disabled: false,
  ownerOnly: false,
  async execute({ client, message }) {
    await message.reply(`Hello <@${message.author.id}>`);
  },
} as MessageCommandModule;
