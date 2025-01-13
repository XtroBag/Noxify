import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Salad",
    plural: "Salads",
  },
  description: "A delicious and filling meal made with fresh ingredients",
  icon: "🥗",
  disabled: false,
  type: "meal",
  effects: [],
  price: 250,
  ingredientsRequired: ['Cucumber', 'Lettuce', 'Onion', 'Tomato'],
  amountPerUser: "unlimited",
} as MealShopItem;
