import {
  DatabaseItems,
  DatabaseCalls,
  DatabaseExtras,
} from "../util/DatabaseUtils";

export enum EffectType {
  Healing = "healing",
  Defense = "defense",
  Stamina = "Stamina",
  Luck = "luck",
  Immunity = "immunity",
}

export interface ClientUtils {
  items: DatabaseItems;
  calls: DatabaseCalls;
  extras: DatabaseExtras;
}

export type ItemType = "meal" | "ingredient" | "drink" | "weapon";
export type WeaponType = "sword" | "gun" | "lightsaber" | "other";

export interface NameStyles {
  singular: string;
  plural: string;
}

export interface Effect {
  name: EffectType;
  lasts: number;
}

export interface DefaultItem {
  name: NameStyles;
  type: ItemType; // The type of item it is.
  description: string; // A short description of the item.
  icon: string; // The icon for the item.
  disabled: boolean; // Whether the item is disabled.
  price: number;
  amountPerUser: number | "unlimited";
}

export interface WeaponShopItem extends DefaultItem {
  damage: number; // The damage the weapon can do.
  weaponType: WeaponType; // More specific weapon types (string literal type)
  durability: number | "unlimited"; // How much the weapon can be used before it's gone or broken.
  requires: string[];
}

export interface DrinkShopItem extends DefaultItem {
  effects: Effect[]; // Effects that the food item grants when consumed.
  ingredientsRequired: string[];
}

export interface MealShopItem extends DefaultItem {
  effects: Effect[];
  ingredientsRequired: string[];
}

export interface IngredientShopItem extends DefaultItem {}

export type ItemModule =
  | WeaponShopItem
  | DrinkShopItem
  | IngredientShopItem
  | MealShopItem;
