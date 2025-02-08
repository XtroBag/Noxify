import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Fries",
    plural: "Fries",
  },
  // description: "",
  icon: Emojis.Fries,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 100,
  ingredientsRequired: [
    { name: "Potato", amountNeeded: 2 },
    { name: "Salt", amountNeeded: 1 },
  ],
  amountPerUser: "Infinite",
} as Meal;
