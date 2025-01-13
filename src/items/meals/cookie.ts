import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Cookie",
    plural: "Cookies",
  },
  description: "A warm, freshly baked cookie that brings comfort and sweetness.",
  icon: "🍪",
  disabled: false,
  type: "meal",
  price: 140,
  amountPerUser: "unlimited",
  effects: [],
  ingredientsRequired: ['Butter', 'Chocolate Bar', 'Egg', 'Flour', 'Sugar'],
} as MealShopItem;
