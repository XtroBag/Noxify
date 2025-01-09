import { Effect, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: 'Strawberry',
    plural: 'Strawberries'
  },
  description: "A sweet fruit that boosts health and energy.",
  type: "food",
  icon: "🍓",
  drinkable: false,
  disabled: false,
  effects: [Effect.Healing],
  price: 7,
  amountPerUser: 'unlimited'
} as FoodShopItem;
