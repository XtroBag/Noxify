import { Events } from "discord.js";
import { DiscordClient } from "../util/DiscordClient";

export interface EventModule {
    name: Events;
    once?: boolean;
    execute: (client: DiscordClient, ...args: any[]) => Promise<void>;
}