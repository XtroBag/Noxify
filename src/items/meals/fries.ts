import { MealShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Fry",
    plural: "Fries",
  },
  // description: "",
  icon: "🍟",
  disabled: false,
  type: "meal",
  effects: [],
  price: 100,
  ingredientsRequired: ['Potato', 'Salt'],
  amountPerUser: "unlimited",
} as MealShopItem;
