import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Salad",
    plural: "Salads",
  },
  description: "A delicious and filling meal made with fresh ingredients",
  icon: Emojis.Salad,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 250,
  ingredientsRequired: [
    { name: "Cucumber", amountNeeded: 3 },
    { name: "Lettuce", amountNeeded: 2 },
    { name: "Onion", amountNeeded: 3 },
    { name: "Tomato", amountNeeded: 2 },
  ],
  amountPerUser: "Infinite",
} as Meal;
