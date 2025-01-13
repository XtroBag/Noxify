import { Emojis } from "../../config";
import { IngredientShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Flour",
    plural: "Flours",
  },
  type: 'ingredient',
  description: "",
  icon: Emojis.Flour,
  disabled: false,
  amountPerUser: 'unlimited',
  price: 30,
} as IngredientShopItem;
