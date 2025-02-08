import { Emojis } from "../../config";
import { Item } from "../../handler/types/economy/EconomyItem";

export = {
  name: {
    singular: "Blueberry",
    plural: "Blueberries",
  },
  shopType: 'ingredients',
  description: "A small, sweet fruit packed with antioxidants.",
  icon: Emojis.BlueBerry,
  disabled: false,
  amountPerUser: 'Infinite',
  price: 30,
} as Item;
