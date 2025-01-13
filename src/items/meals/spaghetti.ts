import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Bowl of Spaghetti",
    plural: "Bowls of Spaghetti",
  },
  description: "",
  icon: "🥪",
  disabled: false,
  type: "meal",
  effects: [],
  price: 70,
  ingredientsRequired: ['Noodle', 'Tomato Sauce'],
  amountPerUser: "unlimited",
} as MealShopItem;
