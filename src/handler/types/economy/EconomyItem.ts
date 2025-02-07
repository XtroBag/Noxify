export interface NameStyles {
  singular: string;
  plural: string;
}

export enum EffectType {
  Healing = "healing",
  Defense = "defense",
  Stamina = "Stamina",
  Luck = "luck",
  Immunity = "immunity",
}

export interface Effect {
  name: EffectType;
  lasts: number;
}

export interface RequiredIngredient {
  name: string;
  amountNeeded: number;
}

export type ItemType = "meals" | "ingredients" | "drinks" | "weapons";
export type WeaponType = "Throwable" | "Ammo" | "Melee" | "Ranged" | "Other";

export interface Item {
  name: NameStyles;
  shopType: ItemType;
  description: string;
  icon: string;
  disabled: boolean;
  price: number;
  amountPerUser: number | "Unlimited";
}

export interface Weapon extends Item {
  damage: number;
  weaponType: WeaponType;
  uses: number | "Unlimited";
  level: number;
  purchasedAt?: Date;
  requires: string[];
}

export interface Meal extends Item {
  effects: Effect[];
  ingredientsRequired: RequiredIngredient[];
}

export interface Drink extends Item {
  effects: Effect[];
  ingredientsRequired: RequiredIngredient[];
}

export type ItemCategory = {
  weapons: Weapon[];
  meals: Meal[];
  drinks: Drink[];
  ingredients: Item[];
};

export type Items = Weapon | Meal | Drink | Item;
