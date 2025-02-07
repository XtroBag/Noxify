import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Sandwich",
    plural: "Sandwiches",
  },
  // description: "",
  icon: Emojis.Sandwich,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 13,
  ingredientsRequired: [
    { name: "Bread", amountNeeded: 1 },
    { name: "Cheese", amountNeeded: 1 },
    { name: "Lettuce", amountNeeded: 1 },
    { name: "Meat", amountNeeded: 1 },
  ],
  amountPerUser: "Unlimited",
} as Meal;
