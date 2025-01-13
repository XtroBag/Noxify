import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Cucumber",
    plural: "Cucumbers",
  },
  type: 'ingredient',
  // description: "",
  icon: "🥒",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 20,
} as IngredientShopItem;
