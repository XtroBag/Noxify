// Enum for effects that food items might have
export enum Effect {
    Healing = "healing", // Restores health
    EnergyBoost = "energy_boost", // Boosts energy or stamina
    DefenseBuff = "defense_buff", // Increases defense or damage reduction
    AttackBoost = "attack_boost", // Increases attack power
    SpeedBoost = "speed_boost", // Increases speed or movement
    Poison = "poison", // Causes damage over time (negative effect)
    Regeneration = "regeneration", // Restores health over time
    Confusion = "confusion", // Causes confusion or disorientation
    BuffStamina = "buff_stamina", // Increases stamina or endurance
    LuckBoost = "luck_boost", // Increases chances of success, crits, or rare drops
    FireResistance = "fire_resistance", // Provides resistance to fire damage
    ColdResistance = "cold_resistance", // Provides resistance to cold or freezing effects
    RadiationResistance = "radiation_resistance", // Provides resistance to radiation damage
    HungerSatisfaction = "hunger_satisfaction", // Satisfies hunger or reduces food usage
    VisionEnhancement = "vision_enhancement", // Improves vision in low-light conditions
    Detox = "detox", // Removes toxins or negative status effects
    AntiSleep = "anti_sleep", // Prevents sleep or exhaustion
    MoodBoost = "mood_boost", // Improves mood, possibly counteracting negative effects like fear or sadness
    Antidote = "antidote", // Cures poison or disease
    StrengthBoost = "strength_boost", // Increases strength for a limited time
    ImmunityBoost = "immunity_boost", // Increases immunity, preventing sickness or disease
  }

  export type ItemType = "weapon" | "food"
  export type WeaponType = "sword" | "knife" | "gun" | "lightsaber" | "other"
  
  export interface DefaultItem {
    name: string; // The name of the item.
    type: ItemType; // The type of item it is.
    description: string; // A short description of the item.
    icon: string; // The icon for the item.
    disabled: boolean; // Whether the item is disabled.
    price: number;
  }
  
  export interface WeaponShopItem extends DefaultItem {
    damage: number; // The damage the weapon can do.
    weaponType: WeaponType; // More specific weapon types (string literal type)
    durability: number | 'unlimited'; // How much the weapon can be used before it's gone or broken.
  }
 
  export interface  FoodShopItem extends DefaultItem {
    drinkable: boolean; // Whether the food is a drink or not.
    effects: Effect[]; // Effects that the food item grants when consumed.
  }
  
  export type ItemModule = WeaponShopItem | FoodShopItem;