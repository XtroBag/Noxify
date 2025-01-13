import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Pineapple",
    plural: "Pineapples",
  },
  description: "A tangy fruit that revitalizes and energizes.",
  icon: "🍍",
  disabled: false,
  type: "ingredient",
  price: 30,
  amountPerUser: "unlimited",
} as IngredientShopItem;
