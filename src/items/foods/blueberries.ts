import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Blueberry",
    plural: "Blueberries",
  },
  description: "A small, sweet fruit packed with antioxidants.",
  icon: "🫐",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 5,
  amountPerUser: "unlimited",
} as FoodShopItem;
