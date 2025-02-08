import { Weapon } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: "Gun",
    plural: "Guns",
  },
  description: "Find some enemies to shoot",
  icon: Emojis.Gun,
  disabled: false,
  shopType: "weapons",
  price: 125,
  amountPerUser: 1,
  weaponType: 'Ranged',
  damage: 82,
  uses: 'Infinite',
  requires: ['Bullet'],
} as Omit<Weapon, 'purchasedAt'>;
