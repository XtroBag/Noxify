import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Noodles",
    plural: "Noodles",
  },
  shopType: 'ingredients',
 // description: "",
  icon: Emojis.Noodles,
  disabled: false,
  amountPerUser: 'Unlimited',
  price: 20,
} as Item;
