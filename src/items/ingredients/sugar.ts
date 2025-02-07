import { Emojis } from "../../config";
import { Item } from "../../handler/types/economy/EconomyItem";

export = {
  name: {
    singular: "Sugar",
    plural: "Sugars",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Sugar,
  disabled: false,
  amountPerUser: 'Unlimited',
  price: 20,
} as Item;
