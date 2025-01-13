import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Cheese",
    plural: "Cheeses",
  },
  description: "A rich and flavorful dairy product",
  icon: "🧀",
  disabled: false,
  type: "ingredient",
  price: 20,
  amountPerUser: "unlimited",
} as IngredientShopItem;
