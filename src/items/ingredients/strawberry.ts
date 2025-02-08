import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Strawberry",
    plural: "Strawberries",
  },
  description: "A sweet fruit that boosts health and energy.",
  shopType: "ingredients",
  icon: Emojis.Strawberry,
  disabled: false,
  price: 20,
  amountPerUser: "Infinite",
} as Item;
