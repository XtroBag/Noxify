import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Strawberry",
    plural: "Strawberries",
  },
  description: "A sweet fruit that boosts health and energy.",
  type: "ingredient",
  icon: "🍓",
  disabled: false,
  price: 20,
  amountPerUser: "unlimited",
} as IngredientShopItem;
