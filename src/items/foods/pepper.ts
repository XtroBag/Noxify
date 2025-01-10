import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Pepper",
    plural: "Peppers",
  },
  description: "A spicy and flavorful pepper that adds a fiery kick to any dish.",
  icon: "🌶",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 3,
  amountPerUser: "unlimited",
} as FoodShopItem;
