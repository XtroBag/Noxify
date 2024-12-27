import { EventModule } from "../handler";
import { Events } from "discord.js";
import { Server } from "../handler/schemas/models/Models";

export = {
  name: Events.GuildDelete,
  async execute({ client, args: [guild] }) {
    await Server.findOneAndDelete({ guildID: guild.id });
  },
} as EventModule<"guildDelete">;
