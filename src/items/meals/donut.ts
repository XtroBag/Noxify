import { Meal, EffectType } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Donut",
    plural: "Donuts",
  },
  description: "A sweet, fried dough pastry, covered in sugar or icing.",
  icon: Emojis.Donut,
  disabled: false,
  shopType: "meals",
  effects: [{ name: EffectType.Luck, lasts: 1000 }],
  ingredientsRequired: [
    { name: "Egg", amountNeeded: 2 },
    { name: "Flour", amountNeeded: 1 },
    { name: "Milk", amountNeeded: 1 },
    { name: "Sugar", amountNeeded: 1 },
  ],
  price: 140,
  amountPerUser: "Infinite",
} as Meal;
