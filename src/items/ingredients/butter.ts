import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Butter",
    plural: "Butters",
  },
  type: 'ingredient',
  description: "",
  icon: "🧈",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 10,
} as IngredientShopItem;
