import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Butter",
    plural: "Butters",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Butter,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 10,
} as Item;
