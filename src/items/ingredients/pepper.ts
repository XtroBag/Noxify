import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Pepper",
    plural: "Peppers",
  },
  description: "A spicy and flavorful pepper that adds a fiery kick to any dish.",
  icon: Emojis.Pepper,
  disabled: false,
  shopType: "ingredients",
  price: 30,
  amountPerUser: "Unlimited",
} as Item;
