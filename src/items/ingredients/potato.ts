import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Potato",
    plural: "Potatoes",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Potato,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 30,
} as Item;
