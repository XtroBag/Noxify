import { Events } from "discord.js";
import Event from "../types/Event";

export default new Event(
  Events.ClientReady,
  { once: true, enabled: true },
  async (noxify, client) => {
    console.log(`Logged in as ${client.user.tag}!`);

  }
);
