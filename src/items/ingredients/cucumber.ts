import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Cucumber",
    plural: "Cucumbers",
  },
  shopType: 'ingredients',
  // description: "",
  icon: Emojis.Cucumber,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 20,
} as Item;
