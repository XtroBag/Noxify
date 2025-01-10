export enum EffectType {
  Healing = "healing",
  Defense = "defense",
  Stamina = "Stamina",
  Luck = "luck",
  Immunity = "immunity",
}

  export type ItemType = "weapon" | "food"
  export type WeaponType = "sword" | "gun" | "lightsaber" | "other"

  export interface NameStyles {
    singular: string;
    plural: string;
  }

  export interface Effect {
    name: EffectType,
    lasts: number
  }
  
  export interface DefaultItem {
    name: NameStyles;
    type: ItemType; // The type of item it is.
    description: string; // A short description of the item.
    icon: string; // The icon for the item.
    disabled: boolean; // Whether the item is disabled.
    price: number;
    amountPerUser: number | 'unlimited';
  }
  
  export interface WeaponShopItem extends DefaultItem {
    damage: number; // The damage the weapon can do.
    weaponType: WeaponType; // More specific weapon types (string literal type)
    durability: number | 'unlimited'; // How much the weapon can be used before it's gone or broken.
    requires: string[]
  }

 
  export interface FoodShopItem extends DefaultItem {
    drinkable: boolean; // Whether the food is a drink or not.
    effects: Effect[]; // Effects that the food item grants when consumed.
  }
  
  export type ItemModule = WeaponShopItem | FoodShopItem;