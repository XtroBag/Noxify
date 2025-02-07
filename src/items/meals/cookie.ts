import { Meal } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Cookie",
    plural: "Cookies",
  },
  description:
    "Freshly baked cookie that brings comfort and sweetness.",
  icon: Emojis.Cookie,
  disabled: false,
  shopType: "meals",
  price: 140,
  amountPerUser: "Unlimited",
  effects: [],
  ingredientsRequired: [
    { name: "Butter", amountNeeded: 1 },
    { name: "Chocolate", amountNeeded: 1 },
    { name: "Egg", amountNeeded: 2 },
    { name: "Flour", amountNeeded: 1 },
    { name: "Sugar", amountNeeded: 1 },
  ],
} as Meal;
