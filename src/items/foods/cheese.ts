import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Cheese",
    plural: "Cheeses",
  },
  description: "A rich and flavorful dairy product",
  icon: "🧀",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 6,
  amountPerUser: "unlimited",
} as FoodShopItem;
