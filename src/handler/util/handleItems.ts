import { glob } from "glob";
import { DiscordClient } from "./DiscordClient";
import { itemsFolderName } from "../../config";
import Logger from "./Logger";
import { Ammo, Drink, Item, Items, Meal, Weapon } from "../types/economy/EconomyItem";

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
      const module: Items = (await import(importPath)).default;

      if (!module.name || !module.shopType) {
        Logger.error(`No name or type set for the item at ${importPath}`);
        continue;
      }

      if (module.disabled) continue;

      totalItems++;

      if (module.shopType === "weapons") {
        client.items[module.shopType].set(module.name.singular, module as Weapon);
      } else if (module.shopType === "ingredients") {
        client.items[module.shopType].set(module.name.singular, module as Item);
      } else if (module.shopType === 'meals') {
        client.items[module.shopType].set(module.name.singular, module as Meal);
      } else if (module.shopType === 'drinks') {
        client.items[module.shopType].set(module.name.singular, module as Drink);
      } else if (module.shopType === 'ammos') {
        client.items[module.shopType].set(module.name.singular, module as Ammo);
      }
    } catch (err) {
      Logger.error(`Failed to load item at ${importPath}`, err);
    }
  }

  Logger.log(`Loaded ${totalItems} items in total.`);
}
