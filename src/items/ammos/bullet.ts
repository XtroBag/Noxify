import { Ammo } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Bullet",
    plural: "Bullets",
  },
  description: "for those crazy guns",
  icon: Emojis.Bullet,
  amountPerUser: 'Infinite',
  disabled: false,
  price: 83,
  shopType: 'ammos',
//--------------------------
  speed: 64,
  specialEffects: []
} as Omit<Ammo, 'purchasedAt'>;
