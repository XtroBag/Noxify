import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Milk",
    plural: "Milks",
  },
  description: "A refreshing drink that boosts your immunity and helps maintain a healthy body.",
  icon: Emojis.Milk,
  disabled: false,
  shopType: "ingredients",
  price: 40,
  amountPerUser: "Unlimited",
} as Item;
