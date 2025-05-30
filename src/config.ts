import { Intent } from "./System/Types/Intent.js";
import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  EmbedBuilder,
} from "discord.js";

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

// Your Discord ID (for owner only commands)
export const ownerId: string = "149621801989701633";

export enum ConsoleColor {
  Black = "\x1b[30m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
  Reset = "\x1b[0m",
}

// Layout for the info logging message.
export function getLoggerLogMessage(message: string): string {
  return `${ConsoleColor.Green}[LOG] ${message}${ConsoleColor.Reset}`;
}

// Layout for the warning logging message.
export function getLoggerWarnMessage(message: string): string {
  return `${ConsoleColor.Yellow}[WARNING] ${message}${ConsoleColor.Reset}`;
}

// Layout for the error logging message.
export function getLoggerErrorMessage(message: string): string {
  return `${ConsoleColor.Red}[ERROR] ${message}${ConsoleColor.Reset}`;
}

export function getLoggerIssueMessage(message: string): string {
  return `${ConsoleColor.Cyan}[ISSUE] ${message}${ConsoleColor.Reset}`;
}

export function getDebugIssueMessage(message: string): string {
  return `${ConsoleColor.Blue}[DEBUG] ${message}${ConsoleColor.Reset}`;
}

// Generates an embed when a user lacks the necessary conditions to execute a command.
export function getCommandNotAllowedEmbed(
  interaction:
    | ChatInputCommandInteraction<"cached">
    | ContextMenuCommandInteraction<"cached">
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
  //---------------------------------------------------------
  Check = "<:Check:1377727500251168798>",
  Cross = "<:Cross:1377727513551179826>",
  Info = "<:Info:1377727530164944896>",
  Unknown = "<:Unknown:1377727558094688266>",
  XtroBag = "<:XtroBag:1327053059179810999>",
  BroBoiler = "<:BroBoiler:1327053036912119890>",
  Noxify = "<:Noxify:1327053875286638624>",
  Blank = "<:Blank:1336760508736475136>",
  Back = "<:Back:1336877193430827079>",
  Forward = "<:Forward:1336877123075309629>",
  Damage = "<:Damage:1336898713875910747>",
  Description = "<:Description:1336898666342125688>",
  Uses = "<:Uses:1336921047303454771>",
  Rock = "<:Rock:1338005457981411431>",
  Paper = "<:Paper:1338005470614392915>",
  Scissors = "<:Scissors:1338005483587375164>",
  //---------------------------------------------------------
  Ammo = "<:Ammo:1337153601126010932>",
  Melee = "<:Melee:1336920971713708084>",
  Ranged = "<:Ranged:1336920871423574019>",
  Throwable = "<:Throwable:1336920821339521107>",
  Other = "<:Other:1336921005821792358>",
  //---------------------------------------------------------
  Wallet = "<:Wallet:1327676494327316544>",
  Bank = "<:Bank:1327676483405086720>",
  Leaderboard = "<:Leaderboard:1327676465852186746>",
  ActiveEffects = "<:ActiveEffects:1327676455055921294>",
  Transactions = "<:Transactions:1327676444213641299>",
  Joined = "<:Joined:1327676433627353198>",
  ReceiveNotifications = "<:ReceiveNotifications:1327682773686685718>",
  ViewInventory = "<:ViewInventory:1327682762529968260>",
  Weapons = "<:Weapons:1327691131001241600>",
  Meals = "<:Meal:1337140908298207312>",
  Drinks = "<:Drinks:1328232919113928765>",
  Ingredients = "<:Ingredients:1328232894837297193>",
  Requires = "<:Requires:1337580573362749530>",
  Speed = "<:Speed:1337600796677636136>",
  SpecialEffects = "<:SpecialEffects:1337600829078634519>",
  Health = "<:Health:1344345265783574649>",
  AutoSlowMode = "<:AutoSlowmode:1344474006992191488>",
  AutoWelcome = "<:Welcome:1345809843931320370>",
  // StartBlank = "<:StartBlank:1340175509522485280>",
  // MiddleBlank = "<:MiddleFill:1344336666395021474>",
  // EndBlank = "<:EndBlank:1340175583493230632>",
  // StartHalf = "<:StartHalf:1344336992573329459>",
  // MiddleHalf = "<:MiddleHalf:1344337049595150378>",
  // EndHalf = "<:EndHalf:1344337083342389360>",
  // StartFill = "<:StartFill:1344336652826312866>",
  // MiddleFill = "<:MiddleFill:1344336666395021474>",
  // EndFill = "<:EndFill:1344336682169798749>",

  //---------------------------------------------------------
  // Drinks
  ChocolateMilk = "<:ChocolateMilk:1337142079348019362>",
  StrawberryMilk = "<:StrawberryMilk:1337142050193150053>",
  //---------------------------------------------------------
  // Ingredients
  BlueBerry = "<:Blueberry:1337141225395982337>",
  Bread = "<:Bread:1337141318459330651>",
  Butter = "<:Butter:1337145852095107133>",
  Cheese = "<:Cheese:1337141356052611163>",
  Chocolate = "<:Chocolate:1337141395084804207>",
  Corn = "<:Corn:1337141439469064223>",
  Cucumber = "<:Cucumber:1337141475951116328>",
  Egg = "<:Egg:1337141509950148740>",
  Flour = "<:Flour:1337141546444652676>",
  Lettuce = "<:Lettuce:1337141584562618470>",
  Meat = "<:Meat:1337141616917614663>",
  Milk = "<:Milk:1337141656473829466>",
  Noodles = "<:Noodles:1337141690246365316>",
  Onion = "<:Onion:1337141722907545702>",
  Pepper = "<:Pepper:1337141757384855697>",
  Pineapple = "<:Pineapple:1337141788275904562>",
  Potato = "<:Potato:1337141835012902942>",
  Salt = "<:Salt:1337141884279324752>",
  Sauce = "<:Sauce:1337141922145370223>",
  Strawberry = "<:Strawberry:1337141953007194163>",
  Sugar = "<:Sugar:1337141993112862814>",
  Tomato = "<:Tomato:1337142023173705859>",
  //---------------------------------------------------------
  // Meals
  Cake = "<:Cake:1337142109446340688>",
  Cookie = "<:Cookie:1337142136075980820>",
  Donut = "<:Donut:1337142158871761009>",
  Fries = "<:Fries:1337142182192222221>",
  Burger = "<:Burger:1337142207047532676>",
  Pizza = "<:Pizza:1337142230980235376>",
  Salad = "<:Salad:1337142253960826940>",
  Sandwich = "<:Sandwich:1337142277738332180>",
  Spaghetti = "<:Spaghetti:1337142300882505819>",
  Taco = "<:Taco:1337142323393462342>",
  //---------------------------------------------------------
  // Weapons
  Bomb = "<:Bomb:1337141016486219807>",
  Bow = "<:Bow:1337141083271991306>",
  Gun = "<:Gun:1337141116176306257>",
  Knife = "<:Knife:1337147545322913852>",
  Saw = "<:Saw:1337141191468253295>",
  //---------------------------------------------------------
  // Ammos
  Arrow = "<:Arrow:1337580232915288074>",
  Bullet = "<:Bullet:1337580206877179935>",
  //---------------------------------------------------------
  // Modrinth Icons
  Bukkit = "<:Bukkit:1370856265902723162>",
  BungeeCord = "<:BungeeCord:1370856325759897690>",
  Canvas = "<:Canvas:1372744502594371734>",
  Fabric = "<:Fabric:1370847660445143220>",
  Folia = "<:Folia:1370856363277811852>",
  Forge = "<:Forge:1370847712957698148>",
  Iris = "<:Iris:1372744536576622672>",
  LiteLoader = "<:LiteLoader:1370847896261496955>",
  ModLoader = "<:ModLoader:1370847936266633266>",
  NeoForge = "<:NeoForge:1370847970559262802>",
  Quilt = "<:Quilt:1370848003832942613>",
  Rift = "<:Rift:1370848035323641957>",
  Optifine = "<:OptiFine:1372744588573413456>",
  PaperMC = "<:Paper_Modrinth:1370856393867006022>",
  Purpur = "<:Purpur:1370856859988262962>",
  Spigot = "<:Spigot:1370856889042210899>",
  Sponge = "<:Sponge:1370856952262955061>",
  Velocity = "<:Velocity:1370856982751215658>",
  Waterfall = "<:Waterfall:1370857010815569992>",
  ModrinthOther = "<:Other_Modrinth:1370860702545346620>",
  ModEnviromentServer = "<:Server:1370876768117850152>",
  ModEnviromentClient = "<:Client:1370876806021775490>",
  ModEnviromentClientAndServer = "<:Server_and_Client:1370876831690919956>",
  Modrinth = "<:Modrinth:1377346953062649857>",
  RequiredType = "<:Required_1:1377733290857074840><:Required_2:1377733304761192568><:Required_3:1377733318417842367><:Required_4:1377733334385426574>",
  OptionalType = "<:Optional_1:1377734822583074988><:Optional_2:1377734885078470768><:Optional_3:1377734923192111284><:Optional_4:1377734963545243709>",
  UnsupportedType = "<:Unsupported_1:1377740732546416774><:Unsupported_2:1377740802922516632><:Unsupported_3:1377740848015343657><:Unsupported_4:1377740892978282516><:Unsupported_5:1377740931637448795>",
  UnknownType = "<:Unknown_1:1377739340817502278><:Unknown_2:1377739404789022770><:Unknown_3:1377739483390283866><:Unknown_4:1377739523437494273>",
  Loaders = "<:Loaders_1:1377745327012184136><:Loaders_2:1377745371832389763><:Loaders_3:1377745384562233465>",
  Categories = "<:Categories_1:1377747999010193539><:Categories_2:1377748047575908555><:Categories_3:1377748071517257928><:Categories_4:1377748114408083597>",
  Versions = "<:Versions_1:1377746124127076423><:Versions_2:1377746169635012608><:Versions_3:1377746196696666212>",
  Downloads = "<:Downloads_1:1377748627161612339><:Downloads_2:1377748666747715624><:Downloads_3:1377748693071036619><:Downloads_4:1377748719021330695>",
  ClientSide = "<:Client_Side_1:1377749378848264212><:Client_Side_2:1377749435915829328><:Client_Side_3:1377749489770561546><:Client_Side_4:1377749515859263599>",
  ServerSide = "<:Server_Side_1:1377751954834587828><:Server_Side_2:1377751967488806932><:Server_Side_3:1377751979803283528><:Server_Side_4:1377751991924560002>",
  Creators = "<:Creators_1:1377746809161781378><:Creators_2:1377746847270961162><:Creators_3:1377746891999281304>"
}

export enum Colors {
  Error = "#FF0800",
  Success = "#55FF00",
  Normal = "#2C2D31",
  Warning = "#FFFF00",
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
