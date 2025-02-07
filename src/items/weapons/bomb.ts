import { Weapon } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Bomb",
    plural: "Bombs",
  },
  description: "A very explosive and dangerous weapon",
  icon: Emojis.Bomb,
  disabled: false,
  shopType: "weapons",
  price: 9,
  amountPerUser: 15,
  weaponType: 'Throwable',
  damage: 54,
  uses: 1,
  requires: []
} as Omit<Weapon, 'purchasedAt'>;
