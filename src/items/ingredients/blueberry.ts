import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Blueberry",
    plural: "Blueberries",
  },
  type: 'ingredient',
  description: "A small, sweet fruit packed with antioxidants.",
  icon: "🫐",
  disabled: false,
  amountPerUser: 'unlimited',
  price: 30,
} as IngredientShopItem;
