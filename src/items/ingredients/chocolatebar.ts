import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Chocolate Bar",
    plural: "Chocolate Bars",
  },
  description: "A sweet and indulgent treat. Perfect for satisfying your sweet tooth.",
  icon: "🍫",
  disabled: false,
  type: "ingredient",
  price: 30,
  amountPerUser: "unlimited",
} as IngredientShopItem;
