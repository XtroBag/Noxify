import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Potato",
    plural: "Potatoes",
  },
  type: 'ingredient',
  // description: "",
  icon: "🥔",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 30,
} as IngredientShopItem;
