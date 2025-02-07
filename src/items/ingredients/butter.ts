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
  amountPerUser: 'Unlimited',
  price: 10,
} as Item;
