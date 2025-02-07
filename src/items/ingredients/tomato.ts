import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Tomato",
    plural: "Tomatoes",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Tomato,
  disabled: false,
  amountPerUser: 'Unlimited',
  price: 20,
} as Item;
