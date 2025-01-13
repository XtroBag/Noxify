import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Tomato Sauce",
    plural: "Tomato Sauces",
  },
  type: 'ingredient',
  description: "",
  icon: "🥫",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 30,
} as IngredientShopItem;
