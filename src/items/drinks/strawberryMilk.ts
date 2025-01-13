import { Emojis } from "../../config";
import { DrinkShopItem } from "src/handler/types/Item";

export = {
    name: {
        singular: 'Strawberry Milk',
        plural: 'Strawberry Milks'
    },
  // description: "",
    icon: Emojis.StrawberryMilk,
    type: 'drink',
    price: 80,
    disabled: false,
    amountPerUser: 'unlimited',
    effects: [],
    ingredientsRequired: ['Strawberry', 'Glass of Milk']
} as DrinkShopItem