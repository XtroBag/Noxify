import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Pizza",
    plural: "Pizzas",
  },
  description: "A delicious, cheesy pizza topped with your favorite ingredients.",
  icon: "🍕",
  drinkable: false,
  disabled: false,
  type: "food",
  effects: [],
  price: 21,
  amountPerUser: "unlimited",
} as FoodShopItem;
