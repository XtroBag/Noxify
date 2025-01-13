import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Cake",
    plural: "Cakes",
  },
  // description: '',
  icon: "🎂",
  disabled: false,
  type: "meal",
  effects: [],
  price: 180,
  ingredientsRequired: ['Butter', 'Egg', 'Flour', 'Glass of Milk', 'Salt', 'Strawberry', 'Sugar'],
  amountPerUser: "unlimited",
} as MealShopItem;
