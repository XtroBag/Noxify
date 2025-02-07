import { EconomyUser } from "./economy/EconomyUser";

export interface ServerData {
  name: string;
  guildID: string;
  prefix: string;
  loggingChannel: string;
  loggingActive: boolean;
}

export interface GuildEconomy {
  name: string;
  guildID: string;
  icon: string;
  defaultBalance: number;
  users: EconomyUser[];
}
