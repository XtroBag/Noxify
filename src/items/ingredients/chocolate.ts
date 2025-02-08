import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Chocolate",
    plural: "Chocolates",
  },
  description: "A sweet and indulgent treat. Perfect for satisfying your sweet tooth.",
  icon: Emojis.Chocolate,
  disabled: false,
  shopType: "ingredients",
  price: 30,
  amountPerUser: "Infinite",
} as Item;
