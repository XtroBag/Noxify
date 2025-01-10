import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Pineapple",
    plural: "Pineapples",
  },
  description: "A tangy fruit that revitalizes and energizes.",
  icon: "🍍",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [{ name: EffectType.Healing, lasts: 12000 }],
  price: 9,
  amountPerUser: "unlimited",
} as FoodShopItem;
