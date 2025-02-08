import { Item } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Bread",
    plural: "Breads",
  },
  shopType: "ingredients",
  description: "A staple food that is soft, warm, and comforting.",
  icon: Emojis.Bread,
  disabled: false,
  price: 20,
  amountPerUser: "Infinite",
} as Item;
