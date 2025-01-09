import { FoodData, Items, UserEconomy, WeaponData } from "../types/Database";
import { ItemType } from "../types/Item";
import { DiscordClient } from "./DiscordClient";

export function getAllItems(client: DiscordClient): Items[] {
  // add future item categories in here to work.
  const allItems = [
    ...Array.from(client.items.weapon.values()),
    ...Array.from(client.items.food.values()),
  ];

  const filtered = allItems.filter((item) => !item.disabled);

  return filtered;
}

export function getItemsByType<T extends ItemType>(
  client: DiscordClient,
  type: T
) {
  // Get the MapIterator for the items of the given type
  const itemsIterator = client.items[type].values();

  // Create an array from the iterator and filter disabled items
  const items: Items[] = [];

  // Use the iterator to populate the items array
  for (const item of itemsIterator) {
    if (!item.disabled) {
      items.push(item);
    }
  }

  // Return the correctly typed array
  return items as T extends "weapon"
    ? WeaponData[]
    : T extends "food"
    ? FoodData[]
    : never;
}

export function getInventoryItems(economy: UserEconomy, itemType?: ItemType) {
  if (itemType) {
    // Return the items of the specified type and filter out disabled items
    return economy.inventory.items[itemType].filter((item) => !item.disabled);
  } else {
    // Return all items from the inventory, excluding disabled ones
    return Object.values(economy.inventory.items)
      .flat() // Flatten the arrays of items from different types
      .filter((item) => !item.disabled);
  }
}

export function getInventoryItemAmount(
  user: UserEconomy,
  itemType: ItemType,
  itemName: string
): number {
  return user.inventory.items[itemType].filter(
    (existingItem) => existingItem.name.singular === itemName
  ).length;
}

export function findItemByName(
  client: DiscordClient,
  buyingItem: string
): Items | undefined {
  const foodItem = client.items.food.find(
    (food) => food.name.singular === buyingItem
  );

  if (foodItem) {
    return foodItem;
  }

  const weaponItem = client.items.weapon.find(
    (weapon) => weapon.name.singular === buyingItem
  );

  return weaponItem;
}
