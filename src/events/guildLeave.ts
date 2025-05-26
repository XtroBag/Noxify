import { EventModule } from "../System/Types/Event.js";
import { Events } from "discord.js";
import { Server } from "../System/Schemas/Models/Models.js";

export default {
  name: Events.GuildDelete,
  async execute({ client, args: [guild] }) {
    await Server.findOneAndDelete({ guildID: guild.id });
  },
} as EventModule<"guildDelete">;
