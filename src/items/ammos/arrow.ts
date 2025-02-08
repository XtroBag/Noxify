import { Ammo } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Arrow",
    plural: "Arrows",
  },
  description: "These are used to shoot from bow",
  icon: Emojis.Arrow,
  amountPerUser: 'Infinite',
  disabled: false,
  price: 75,
  shopType: 'ammos',
//--------------------------
  speed: 23,
  specialEffects: []
} as Omit<Ammo, 'purchasedAt'>;
