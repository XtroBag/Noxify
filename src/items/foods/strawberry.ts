import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Strawberry",
    plural: "Strawberries",
  },
  description: "A sweet fruit that boosts health and energy.",
  type: "food",
  icon: "🍓",
  drinkable: false,
  disabled: false,
  effects: [
    { name: EffectType.Healing, lasts: 12000 },
    { name: EffectType.Luck, lasts: 80000 },
  ],
  price: 5,
  amountPerUser: "unlimited",
} as FoodShopItem;
