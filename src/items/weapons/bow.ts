import { Weapon } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Bow",
    plural: "Bows",
  },
  description: "A powerful ranged weapon, ideal for precision shooting.",
  icon: Emojis.Bow,
  disabled: false, 
  shopType: "weapons",
  price: 125,
  amountPerUser: 1,
  weaponType: "Ranged",
  damage: 82,
  requires: ['Arrow'],
  uses: 'Infinite',
} as Omit<Weapon, 'purchasedAt'>;
