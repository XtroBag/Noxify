import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Bread",
    plural: "Breads",
  },
  description: "A staple food that is soft, warm, and comforting.",
  icon: "🍞",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 7,
  amountPerUser: "unlimited",
} as FoodShopItem;
