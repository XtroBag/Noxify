import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Bread",
    plural: "Breads",
  },
  type: "ingredient",
  description: "A staple food that is soft, warm, and comforting.",
  icon: "🍞",
  disabled: false,
  price: 20,
  amountPerUser: "unlimited",
} as IngredientShopItem;
