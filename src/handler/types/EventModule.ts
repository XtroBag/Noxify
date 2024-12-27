import { ClientEvents, Events } from 'discord.js';
import { DiscordClient } from "../util/DiscordClient";

type EventArguments<T extends keyof ClientEvents | Events> = T extends keyof ClientEvents
  ? ClientEvents[T]
  : never;

export interface EventModule<T extends keyof ClientEvents | Events> {
  name: T;
  once?: boolean;
  execute: (params: { client: DiscordClient, args: EventArguments<T> }) => Promise<any>;
}
