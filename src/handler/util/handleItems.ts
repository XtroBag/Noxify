import { glob } from "glob";
import { DiscordClient } from "./DiscordClient";
import { itemsFolderName } from "../../config";
import Logger from "./Logger";
import { ItemModule } from "../types/Item";
import { FoodData, WeaponData } from "../types/Database";

export async function registerItems(client: DiscordClient) {
  await getItemModules(client);
}

async function getItemModules(client: DiscordClient): Promise<void> {
  const itemPaths: string[] = await glob(`**/${itemsFolderName}/**/**/*.js`);

  let totalItems = 0;

  for (const itemPath of itemPaths) {
    const importPath: string = `../..${itemPath.replace(
      /^dist[\\\/]|\\/g,
      "/"
    )}`;

    try {
      const module: ItemModule = (await import(importPath)).default;

      if (!module.name || !module.type) {
        Logger.error(`No name or type set for the item at ${importPath}`);
        continue;
      }

      if (module.disabled) continue;

      totalItems++;

      if (module.type === "weapon") {
        client.items[module.type].set(module.name, module as WeaponData);
      } else if (module.type === "food") {
        client.items[module.type].set(module.name, module as FoodData);
      }
    } catch (err) {
      Logger.error(`Failed to load item at ${importPath}`, err);
    }
  }

  Logger.log(`Loaded ${totalItems} items in total.`);
}
