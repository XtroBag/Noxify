import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Salt",
    plural: "Salts",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Salt,
  disabled: false,
  amountPerUser: 'Unlimited',
  price: 20,
} as Item;
