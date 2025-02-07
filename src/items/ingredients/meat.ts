import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Meat",
    plural: "Meats",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Meat,
  disabled: false,
  amountPerUser: 'Unlimited',
  price: 30,
} as Item;
