import { Emojis } from "../../config";
import { Item } from "../../handler/types/economy/EconomyItem";

export = {
  name: {
    singular: "Egg",
    plural: "Eggs",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Egg,
  disabled: false,
  amountPerUser: 'Unlimited',
  price: 10,
} as Item;
