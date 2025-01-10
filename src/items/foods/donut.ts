import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Donut",
    plural: "Donuts",
  },
  description: "A sweet, fried dough pastry, covered in sugar or icing.",
  icon: "🍩",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 5,
  amountPerUser: "unlimited",
} as FoodShopItem;
