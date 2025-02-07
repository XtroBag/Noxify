import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Spaghetti",
    plural: "Spaghetti",
  },
  // description: "",
  icon: Emojis.Spaghetti,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 70,
  ingredientsRequired: [
    { name: "Noodles", amountNeeded: 1 },
    { name: "Sauce", amountNeeded: 1 },
  ],
  amountPerUser: "Unlimited",
} as Meal;
