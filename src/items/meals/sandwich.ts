import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Sandwich",
    plural: "Sandwiches",
  },
  // description: "",
  icon: "🥪",
  disabled: false,
  type: "meal",
  effects: [],
  price: 13,
  ingredientsRequired: [],
  amountPerUser: "unlimited",
} as MealShopItem;
