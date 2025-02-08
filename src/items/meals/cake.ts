import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Cake",
    plural: "Cakes",
  },
  // description: '',
  icon: Emojis.Cake,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 180,
  ingredientsRequired: [
    { name: "Butter", amountNeeded: 1 },
    { name: "Egg", amountNeeded: 2 },
    { name: "Flour", amountNeeded: 1 },
    { name: "Milk", amountNeeded: 1 },
    { name: "Salt", amountNeeded: 1 },
    { name: "Sugar", amountNeeded: 1 },
  ],
  amountPerUser: "Infinite",
} as Meal;
