import { Effect, FoodShopItem } from "../../handler/types/Item";

export = {
  name: "Strawberry",
  description: "A sweet fruit that boosts health and energy.",
  type: "food",
  icon: "🍓",
  drinkable: false, //set to false
  disabled: false,
  effects: [Effect.Healing],
  price: 7,
  amountPerUser: 'unlimited'
} as FoodShopItem;
