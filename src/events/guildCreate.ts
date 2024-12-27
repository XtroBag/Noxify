import { EventModule } from "../handler";
import { Server } from "../handler/schemas/models/Models";
import { Events } from "discord.js";

export = {
  name: Events.GuildCreate,
  async execute({ client, args: [guild] }) {
    await Server.create({
      name: guild.name,
      guildID: guild.id,
    });
  },
} as EventModule<'guildCreate'>;
