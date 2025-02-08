import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Lettuce",
    plural: "Lettuces",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Lettuce,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 10,
} as Item;
