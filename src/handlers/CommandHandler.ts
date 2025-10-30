import { join } from "path";
import { readdirSync } from "fs";
import { Noxify } from "./Client";
import type Command from "../types/Command";

export const loadCommands = async (client: Noxify): Promise<void> => {
  const foldersPath = join(__dirname, "../commands");
  const commandFolders = readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const imported = await import(filePath);
      const command: Command = imported.default;

      if (
        !command ||
        typeof command.data?.name !== "string" ||
        typeof command.execute !== "function"
      ) {
        console.log(`Skipping File: ${file}`);
        continue;
      }

      if (command.options.enabled === false) {
        console.log(`Skipping Disabled Command: ${command.data.name}`);
        continue;
      }

      client.commands.set(command.data.name, command);
    }
  }
};
