import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Onion",
    plural: "Onions",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Onion,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 30,
} as Item;
