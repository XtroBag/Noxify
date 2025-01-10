import { EffectType, FoodShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Milk",
    plural: "Milks",
  },
  description: "A refreshing drink that boosts your immunity and helps maintain a healthy body.",
  icon: "🥛",
  drinkable: true,
  disabled: false,
  type: "food",
  effects: [{ name: EffectType.Immunity, lasts: 12000 }],
  price: 7,
  amountPerUser: "unlimited",
} as FoodShopItem;
