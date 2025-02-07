import { Weapon } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: 'Knife',
    plural: 'Knives'
  },
  description: "A sharp weapon for close combat.",
  icon: Emojis.Knife,
  disabled: false,
  shopType: "weapons",
  price: 11,
  damage: 14,
  uses: 200,
  weaponType: 'Melee',
  amountPerUser: 1,
  requires: []
} as Omit<Weapon, 'purchasedAt'>;
