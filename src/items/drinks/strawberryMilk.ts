import { Emojis } from "../../config";
import { Drink } from "../../handler/types/economy/EconomyItem";

export = {
  name: {
    singular: "Strawberry Milk",
    plural: "Strawberry Milks",
  },
  description: "",
  icon: Emojis.StrawberryMilk,
  shopType: "drinks",
  price: 80,
  disabled: false,
  amountPerUser: "Unlimited",
  effects: [],
  ingredientsRequired: [
    { name: "Strawberry", amountNeeded: 1 },
    { name: "Milk", amountNeeded: 1 },
  ],
} as Drink;
