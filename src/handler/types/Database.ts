import { EconomyUser } from "./economy/EconomyUser";

export interface AutoSlowMode {
  enabled: boolean;
  shortestTime: number;
  moderateTime: number;
  highestTime: number;
  messageCounts: { timestamp: number; count: number }[];
  channels: string[]
}

export interface AutoWelcome {
  enabled: boolean;
  message: string;
  channel: string
}

export interface ServerData {
  name: string;
  guildID: string;
  prefix: string;
  loggingChannel: string;
  loggingActive: boolean;
  autoSlowmode: AutoSlowMode;
  autoWelcome: AutoWelcome;
}

export interface GuildEconomy {
  name: string;
  guildID: string;
  icon: string;
  defaultBalance: number;
  users: EconomyUser[];
}
