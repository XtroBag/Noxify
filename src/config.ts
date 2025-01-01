import { Intent, ConsoleColor } from "./handler";
import { ChatInputCommandInteraction, ContextMenuCommandInteraction, EmbedBuilder } from "discord.js";

// Message command prefix.
export const defaultPrefix: string = ".";

// Intents which will be enabled by default.
export const defaultIntents: Intent[] = [
  Intent.Guilds,
  Intent.MessageContent,
  Intent.GuildMembers,
  Intent.GuildPresences,
  Intent.GuildMessageReactions,
];

// Default folder names.
export const eventsFolderName: string = "events";
export const commandsFolderName: string = "commands";
export const componentsFolderName: string = "components";

export const milestones: number[] = [
  1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000,
  13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,
];
export const validCurrencySymbols = ["$", "€", "£", "¥", "₣", "₹"];

// Your Discord ID (for owner only commands)
export const ownerId: string = "149621801989701633";

// Layout for the info logging message.
export function getLoggerLogMessage(message: string): string {
  return `${ConsoleColor.Green}[INFO] ${message}${ConsoleColor.Reset}`;
}

// Layout for the warning logging message.
export function getLoggerWarnMessage(message: string): string {
  return `${ConsoleColor.Yellow}[WARNING] ${message}${ConsoleColor.Reset}`;
}

// Layout for the error logging message.
export function getLoggerErrorMessage(message: string): string {
  return `${ConsoleColor.Red}[ERROR] ${message}${ConsoleColor.Reset}`;
}

// Generates an embed when a user lacks the necessary conditions to execute a command.
export function getCommandNotAllowedEmbed(
  interaction: ChatInputCommandInteraction<"cached"> | ContextMenuCommandInteraction<'cached'>
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("You are not allowed to use this command!")
    .setColor("#DA373C");
}

export function getCommandOnCooldownEmbed(
  timeLeft: number,
  commandName: string
): EmbedBuilder {
  const expirationTimestamp = Math.floor(Date.now() / 1000) + timeLeft;

  // Format the expiration time as a Discord timestamp
  const timestamp = `<t:${expirationTimestamp}:R>`; // F = Full format (e.g., "December 31, 2024 12:00 AM")

  // Return the embed with the formatted time left
  return new EmbedBuilder()
    .setTitle("Command on cooldown")
    .setColor("#DA373C")
    .setDescription(
      `You can reuse the \`${commandName}\` command ${timestamp}.`
    );
}

export function formatCooldown(cooldownSeconds: number) {
  // If there's no cooldown, return "none"
  if (!cooldownSeconds || cooldownSeconds === 0) {
    return "None";
}
  // Calculate minutes and seconds
  const minutes = Math.floor(cooldownSeconds / 60);
  const seconds = cooldownSeconds % 60;

  // Format the output string
  let result = "";

  if (minutes > 0) {
    result += `${minutes} min`;
  }
  if (seconds > 0) {
    result += ` ${seconds} sec`;
  }

  return result.trim();
}

export function getBotBadges(bot: any) {
  const array: string[] = [];

  if ((bot.flags & (1 << 6)) != 0) {
    array.push(BotBadges.ApplicationAutoModerationRuleCreateBadge);
  }

  if ((bot.flags & (1 << 23)) != 0) {
    array.push(BotBadges.ApplicationCommandBadge);
  }

  return array;
}

export function getBotIntents(bot: any) {
  const array: string[] = [];

  if ((bot.flags & (1 << 12)) != 0) {
    array.push("- Presence");
  }

  if ((bot.flags & (1 << 14)) != 0) {
    array.push("- GuildMembers");
  }

  if ((bot.flags & (1 << 18)) != 0) {
    array.push("- MessageContent");
  }

  return array.length > 0 ? `\n${array.join("\n")}` : "";
}

export enum Emojis {
  Online = "<:Online:1222248216309796965>",
  Idle = "<:Idle:1222248214783328308>",
  Dnd = "<:Dnd:1222248214212902932>",
  Invisible = "<:Invisible:1222248212350636163>",
  YouTube = "<:YouTube:1225327071085989889>",
  Twitch = "<:Twitch:1225327073363628052>",
  DesktopOnline = "<:DesktopOnline:1225363486662725663>",
  MobileOnline = "<:MobileOnline:1225363540895076353>",
  WebOnline = "<:WebOnline:1225372401932566570>",
  DesktopIdle = "<:DesktopIdle:1225363542631251998>",
  MobileIdle = "<:MobileIdle:1225363493692375112>",
  WebIdle = "<:WebIdle:1225372399734624296>",
  DesktopDnd = "<:DesktopDnd:1225363491016151053>",
  MobileDnd = "<:MobileDnd:1225363543872765952>",
  WebDnd = "<:WebDnd:1225372400947040346>",
  Check = "<:Check:1248112241249882133>",
  Cross = "<:Cross:1248112240452964482>",
}

export enum Colors {
  Error = "#FF0000",
  Success = "#008000",
  Normal = "#2C2D31",
  Warning = "#d1ad0a",
}

enum BadgeCustomName {
  Automod = "<:AutoMod:1221958535894667304>",
  SupportsCommands = "<:SupportsCommands:1221958743705522276>",
  Staff = "<:DiscordStaff:1221958741860024449>",
  ActiveDeveloper = "<:ActiveDeveloper:1221958534833508473>",
  BugHunter1 = "<:BugHunter1:1221958537870180473>",
  BugHunter2 = "<:BugHunter2:1221958539455631451>",
  EarlySupporter = "<:EarlySupporter:1221958540789420104>",
  HypeSquadBalance = "<:HypesquadBalance:1221958546111987712>",
  HypeSquadBravery = "<:HypesquadBravery:1221958742879506482>",
  HypeSquadBrilliance = "<:HypesquadBrilliance:1221958550067216517>",
  HypeSquadEvents = "<:HypesquadEvents:1221958552420094063>",
  PartneredServer = "<:DiscordPartner:1221958543306129500>",
  VerifiedDeveloper = "<:EarlyVerifiedDeveloper:1221958536842707094>",
  ModeratorProgramsAlumni = "<:DiscordModerator:1221958542265942127>",
  VerifiedDiscordBot = "<:VerifiedBot:1225879841488769196>",
  UnverifiedDiscordBot = "<:Bot:1225879840238997605>",
  Username = "<:Username:1221958557415772301>",
  ServerBoost = "<:ServerBoost:1221965613929594953>",
  PremiumBot = "<:PremiumBot:1222015664718610472>",
  DiscordNitro = "<:Nitro:1260760237363957781>",
}

export enum ExtraBadges {
  OrginallyKnownAs = BadgeCustomName.Username,
  ServerBoosting = BadgeCustomName.ServerBoost,
  PremiumBotSubcription = BadgeCustomName.PremiumBot,
  UnverifiedBot = BadgeCustomName.UnverifiedDiscordBot,
}

export enum UserBadges {
  ActiveDeveloper = BadgeCustomName.ActiveDeveloper,
  BugHunterLevel1 = BadgeCustomName.BugHunter1,
  BugHunterLevel2 = BadgeCustomName.BugHunter2,
  HypeSquadOnlineHouse1 = BadgeCustomName.HypeSquadBravery,
  HypeSquadOnlineHouse2 = BadgeCustomName.HypeSquadBrilliance,
  HypeSquadOnlineHouse3 = BadgeCustomName.HypeSquadBalance,
  Hypesquad = BadgeCustomName.HypeSquadEvents,
  Partner = BadgeCustomName.PartneredServer,
  Staff = BadgeCustomName.Staff,
  PremiumEarlySupporter = BadgeCustomName.EarlySupporter,
  VerifiedDeveloper = BadgeCustomName.VerifiedDeveloper,
  CertifiedModerator = BadgeCustomName.ModeratorProgramsAlumni,
  VerifiedBot = BadgeCustomName.VerifiedDiscordBot,
  Nitro = BadgeCustomName.DiscordNitro,
}

export enum BotBadges {
  ApplicationAutoModerationRuleCreateBadge = BadgeCustomName.Automod,
  ApplicationCommandBadge = BadgeCustomName.SupportsCommands,
}

export enum BoostBadges {
  Month1 = "<:Month1:1225538402208972860>",
  Month2 = "<:Month2:1225538403374989313>",
  Month3 = "<:Month3:1225538405706764409>",
  Month6 = "<:Month6:1225538407275429999>",
  Month9 = "<:Month9:1225538408278130738>",
  Month12 = "<:Month12:1225538409179648000>",
  Month15 = "<:Month15:1225538409750331476>",
  Month18 = "<:Month18:1225538411226595462>",
  Month24 = "<:Month24:1225538445913362433>",
}

export enum IntegrationType {
  Guild = 0,
  User = 1,
}

export enum ContextType {
  Guild = 0,
  BotDM = 1,
  PrivateChannel = 2,
}
