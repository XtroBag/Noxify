import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Chocolate Bar",
    plural: "Chocolate Bars",
  },
  description: "A sweet and indulgent treat. Perfect for satisfying your sweet tooth.",
  icon: "🍫",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 3,
  amountPerUser: "unlimited",
} as FoodShopItem;
