import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Sauce",
    plural: "Sauces",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Sauce,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 30,
} as Item;
