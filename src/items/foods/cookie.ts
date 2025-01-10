import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Cookie",
    plural: "Cookies",
  },
  description: "A warm, freshly baked cookie that brings comfort and sweetness.",
  icon: "🍪",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 2,
  amountPerUser: "unlimited",
} as FoodShopItem;
