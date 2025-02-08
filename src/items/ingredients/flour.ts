import { Emojis } from "../../config";
import { Item } from "../../handler/types/economy/EconomyItem";

export = {
  name: {
    singular: "Flour",
    plural: "Flours",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Flour,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 30,
} as Item;
