import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Meat",
    plural: "Meats",
  },
  type: 'ingredient',
  // description: "",
  icon: "🥩",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 30,
} as IngredientShopItem;
