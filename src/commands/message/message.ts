import { CommandTypes, MessageCommandModule } from "../../handler/types/Command";

export = {
  name: "Hello",
  type: CommandTypes.MessageCommand,
  disabled: false,
  ownerOnly: false,
  async execute({ client, message }) {
    await message.reply(`Hello <@${message.author.id}>`);
  },
} as MessageCommandModule;
