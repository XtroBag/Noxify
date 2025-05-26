import { REST, Routes } from "discord.js";
import { RegisterTypes, SlashCommandModule } from "./System/Types/Command.js";
import Logger from "./System/Utils/Functions/Handlers/Logger.js";
import { glob } from "glob";
import { commandsFolderName } from "./config.js";
import { pathToFileURL } from "node:url";
import "dotenv/config";

async function uploadSlashCommands(
  type: RegisterTypes,
  commands: Array<any>
): Promise<void> {
  if (!process.env.CLIENT_TOKEN) {
    return Logger.error("No process.env.TOKEN set.");
  }

  if (!process.env.CLIENT_ID) {
    return Logger.error("No process.env.CLIENT_ID set.");
  }

  if (RegisterTypes.Guild && !process.env.GUILD_ID) {
    return Logger.error("No process.env.GUILD_ID set.");
  }

  const rest: REST = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN
  );
  try {
    await rest.put(
      Routes[type](process.env.CLIENT_ID, process.env.GUILD_ID || ""),
      { body: commands }
    );

    Logger.log(
      `Successfully reloaded ${commands.length} application commands.`
    );
  } catch (err) {
    Logger.error("Error while uploading slash commands.", err);
  }
}

async function getSlashCommandFiles(): Promise<any[]> {
  const slashCommands: any[] = [];

  const commandPaths: string[] = await glob(
    `**/${commandsFolderName}/slash/**/*.js`,
    { absolute: true }
  );

  for (const commandPath of commandPaths) {
    try {
        const fileUrl = pathToFileURL(commandPath).href;

        const module: SlashCommandModule = (await import(fileUrl)).default;

      if (
        !module.data ||
        !module.data.name ||
        !module.data.description ||
        !module.execute
      ) {
        Logger.issue(
          `Command at ${commandPath} is missing required properties (data, name, description, or execute). Skipping.`
        );
        continue;
      }

      if (!module.data || Object.keys(module.data).length === 0) {
        Logger.warn(
          `Command at ${commandPath} is empty or lacks essential content.`
        );
        continue;
      }

      if (module.disabled) {
        continue;
      }

      slashCommands.push(module.data.toJSON());
    } catch (err) {
      Logger.error(`Failed to load command at ${commandPath}`, err);
    }
  }

  return slashCommands;
}

async function deploySlashCommands() {
  try {
    const slashCommands = await getSlashCommandFiles();

    if (slashCommands.length > 0) {
      await uploadSlashCommands(RegisterTypes.Global, slashCommands);
    } else {
      Logger.warn("No Slash Commands to deploy.");
    }
  } catch (err) {
    Logger.error("Error during deployment process", err);
  }
}

deploySlashCommands();
