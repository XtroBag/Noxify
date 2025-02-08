import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Taco",
    plural: "Tacos",
  },
  // description: "",
  icon: Emojis.Taco,
  disabled: false,
  shopType: "meals",
  effects: [],
  price: 110,
  ingredientsRequired: [
    { name: "Corn", amountNeeded: 1 },
    { name: "Cheese", amountNeeded: 1 },
    { name: "Lettuce", amountNeeded: 1 },
    { name: "Meat", amountNeeded: 1 },
  ],
  amountPerUser: "Infinite",
} as Meal;
