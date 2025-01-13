import { Emojis } from "../../config";
import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Sugar",
    plural: "Sugars",
  },
  type: 'ingredient',
  // description: "",
  icon: Emojis.Sugar,
  disabled: false,
  amountPerUser: 'unlimited',
  price: 20,
} as IngredientShopItem;
