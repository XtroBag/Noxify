import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Pizza",
    plural: "Pizzas",
  },
  description:
    "Cheesy pizza topped with your favorite ingredients.",
  icon: Emojis.Pizza,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 200,
  amountPerUser: "Infinite",
  ingredientsRequired: [
    { name: "Bread", amountNeeded: 1 },
    { name: "Cheese", amountNeeded: 1 },
    { name: "Pepper", amountNeeded: 4 },
  ],
} as Meal;
