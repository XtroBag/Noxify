import { Emojis } from "../../config";
import { Drink } from "../../handler/types/economy/EconomyItem";

export = {
  name: {
    singular: "Chocolate Milk",
    plural: "Chocolate Milks",
  },
  description: "Very good milk for adults",
  icon: Emojis.ChocolateMilk,
  shopType: "drinks",
  price: 90,
  disabled: false,
  amountPerUser: "Infinite",
  effects: [],
  ingredientsRequired: [
    { name: "Chocolate", amountNeeded: 1 },
    { name: "Milk", amountNeeded: 1 },
  ],
} as Drink;
