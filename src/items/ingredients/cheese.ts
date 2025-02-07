import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Cheese",
    plural: "Cheeses",
  },
  description: "A rich and flavorful dairy product",
  icon: Emojis.Cheese,
  disabled: false,
  shopType: "ingredients",
  price: 20,
  amountPerUser: "Unlimited",
} as Item;
