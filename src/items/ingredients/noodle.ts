import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Noodle",
    plural: "Noodles",
  },
  type: 'ingredient',
  description: "",
  icon: "🍜",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 20,
} as IngredientShopItem;
