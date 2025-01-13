import { EffectType, MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Donut",
    plural: "Donuts",
  },
  description: "A sweet, fried dough pastry, covered in sugar or icing.",
  icon: "🍩",
  disabled: false,
  type: "meal",
  effects: [{ name: EffectType.Luck, lasts: 1000 }],
  ingredientsRequired: ['Egg', 'Flour', 'Glass of Milk', 'Sugar'],
  price: 140,
  amountPerUser: "unlimited",
} as MealShopItem;
