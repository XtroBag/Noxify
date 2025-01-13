import { Emojis } from "../../config";
import { DrinkShopItem } from "src/handler/types/Item";

export = {
    name: {
        singular: 'Chocolate Milk',
        plural: 'Chocolate Milks'
    },
  // description: "",
    icon: Emojis.ChocolateMilk,
    type: 'drink',
    price: 90,
    disabled: false,
    amountPerUser: 'unlimited',
    effects: [],
    ingredientsRequired: ['Chocolate Bar', 'Glass of Milk']
} as DrinkShopItem