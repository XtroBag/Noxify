import { EventModule } from "../System/Types/Event.js";
import { Server } from "../System/Schemas/Models/Models.js";
import { Events } from "discord.js";

export default {
  name: Events.GuildCreate,
  async execute({ client, args: [guild] }) {
    await Server.create({
      name: guild.name,
      guildID: guild.id
    });
  },
} as EventModule<'guildCreate'>;
