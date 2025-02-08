import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Pineapple",
    plural: "Pineapples",
  },
  description: "A tangy fruit that revitalizes and energizes.",
  icon: Emojis.Pineapple,
  disabled: false,
  shopType: "ingredients",
  price: 30,
  amountPerUser: "Infinite",
} as Item;
