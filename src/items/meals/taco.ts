import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Taco",
    plural: "Tacos",
  },
  description: "",
  icon: "🌮",
  disabled: false,
  type: "meal",
  effects: [],
  price: 110,
  ingredientsRequired: ['Corn', 'Cheese', 'Lettuce', 'Meat'],
  amountPerUser: "unlimited",
} as MealShopItem;
