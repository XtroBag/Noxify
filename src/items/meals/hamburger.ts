import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Hambuger",
    plural: "Hamburgers",
  },
  description: "",
  icon: "🍔",
  disabled: false,
  type: "meal",
  effects: [],
  price: 150,
  ingredientsRequired: ['Bread', 'Cheese', 'Lettuce', 'Meat', 'Tomato'],
  amountPerUser: "unlimited",
} as MealShopItem;
