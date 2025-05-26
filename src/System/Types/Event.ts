import { ClientEvents } from 'discord.js';
import { DiscordClient } from "../Utils/Functions/Handlers/DiscordClient.js";

export interface EventModule<T extends keyof ClientEvents> {
  name: T;
  once?: boolean;
  execute: (params: { client: DiscordClient, args: ClientEvents[T] }) => Promise<any>;
}
