import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Burger",
    plural: "Burgers",
  },
  // description: "",
  icon: Emojis.Burger,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 150,
  ingredientsRequired: [
    { name: "Bread", amountNeeded: 2 },
    { name: "Cheese", amountNeeded: 1 },
    { name: "Lettuce", amountNeeded: 1 },
    { name: "Meat", amountNeeded: 1 },
    { name: "Tomato", amountNeeded: 1 },
  ],
  amountPerUser: "Unlimited",
} as Meal;
