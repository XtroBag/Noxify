import { ClientEvents } from 'discord.js';
import { DiscordClient } from "../util/DiscordClient";

export interface EventModule<T extends keyof ClientEvents> {
  name: T;
  once?: boolean;
  execute: (params: { client: DiscordClient, args: ClientEvents[T] }) => Promise<any>;
}
