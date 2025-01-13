import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Egg",
    plural: "Eggs",
  },
  type: 'ingredient',
  // description: "",
  icon: "🥚",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 10,
} as IngredientShopItem;
