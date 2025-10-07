import { ClientEvents } from "discord.js";
import { Noxify } from "../handlers/Client";

interface EventOptions {
  once?: boolean;
  enabled?: boolean;
}

export default class Event<Key extends keyof ClientEvents> {
  public name: Key;
  public once: boolean;
  public enabled: boolean;
  public execute: (client: Noxify, ...args: ClientEvents[Key]) => Promise<void>;

  constructor(
    name: Key,
    options: EventOptions = {},
    execute: (client: Noxify, ...args: ClientEvents[Key]) => Promise<void>
  ) {
    this.name = name;
    this.once = options.once ?? false;
    this.enabled = options.enabled ?? true;
    this.execute = execute;
  }
}
