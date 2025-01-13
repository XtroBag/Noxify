import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Glass of Milk",
    plural: "Glasses of Milk",
  },
  description: "A refreshing drink that boosts your immunity and helps maintain a healthy body.",
  icon: "🥛",
  disabled: false,
  type: "ingredient",
  price: 40,
  amountPerUser: "unlimited",
} as IngredientShopItem;
