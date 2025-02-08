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

export type ItemType = "meals" | "ingredients" | "drinks" | "weapons" | "ammos";
export type WeaponType = "Throwable" | "Melee" | "Ranged" | "Other";
export type Items = Weapon | Meal | Drink | Item | Ammo;

export interface Item {
  name: NameStyles;
  shopType: ItemType;
  description: string;
  icon: string;
  disabled: boolean;
  price: number;
  amountPerUser: number | "Infinite";
}

export interface Weapon extends Item {
  damage: number;
  weaponType: WeaponType;
  uses: number | "Infinite";
  level: number;
  purchasedAt?: Date;
  requires: string[];
}

export interface Ammo extends Item {
  speed: number,
  specialEffects: string[]
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
  ammos: Ammo[];
};
