import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Onion",
    plural: "Onions",
  },
  type: 'ingredient',
  // description: "",
  icon: "🧅",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 30,
} as IngredientShopItem;
