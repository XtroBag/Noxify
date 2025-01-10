import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Sandwich",
    plural: "Sandwiches",
  },
  description: "A delicious and filling meal made with fresh ingredients",
  icon: "🥪",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 13,
  amountPerUser: "unlimited",
} as FoodShopItem;
