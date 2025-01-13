import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Pepper",
    plural: "Peppers",
  },
  description: "A spicy and flavorful pepper that adds a fiery kick to any dish.",
  icon: "🌶",
  disabled: false,
  type: "ingredient",
  price: 30,
  amountPerUser: "unlimited",
} as IngredientShopItem;
