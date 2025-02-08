import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Corn",
    plural: "Corns",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Corn,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 20,
} as Item;
