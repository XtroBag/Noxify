import { EventModule } from "../handler";
import { Server } from "../handler/schemas/models/Models";
import { ChannelType, Events, Guild } from "discord.js";

export = {
  name: Events.GuildCreate,
  async execute(client, guild: Guild): Promise<any> {
    console.log(`Joined ${guild.name}`)


     await Server.create({
      name: guild.name,
      guildID: guild.id
    });
  },
} as EventModule;
