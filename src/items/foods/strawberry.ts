import { Effect, FoodShopItem } from "../../handler/types/Item";

export = {
  name: "Strawberry",
  description: "A sweet fruit that boosts health and energy.",
  type: "food",
  icon: "🍓",
  drinkable: false,
  disabled: false,
  effects: [Effect.Healing, Effect.EnergyBoost],
  price: 7,
} as FoodShopItem;
