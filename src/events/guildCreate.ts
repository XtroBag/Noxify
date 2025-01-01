import { EventModule } from "../handler";
import { Server } from "../handler/schemas/models/Models";
import { Events } from "discord.js";
import { defaultPrefix } from "../config";

export = {
  name: Events.GuildCreate,
  async execute({ client, args: [guild] }) {
    await Server.create({
      name: guild.name,
      guildID: guild.id,
      prefix: defaultPrefix
    });
  },
} as EventModule<'guildCreate'>;
