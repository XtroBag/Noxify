import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Pizza",
    plural: "Pizzas",
  },
  description: "A delicious, cheesy pizza topped with your favorite ingredients.",
  icon: "🍕",
  disabled: false,
  type: "meal",
  effects: [],
  price: 200,
  amountPerUser: "unlimited",
  ingredientsRequired: ['Bread', 'Cheese', 'Pepper'] // make this an array of objects with data like this:       ingredientsRequired: [{ name: string, amountRequired: number }]
} as MealShopItem;
