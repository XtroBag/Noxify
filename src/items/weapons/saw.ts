import { Weapon } from "../../handler/types/economy/EconomyItem";
import { Emojis } from "../../config";

export = {
  name: {
    singular: 'Saw',
    plural: 'Saws'
  },
  description: "A durable tool for slicing through tough opponents.",
  icon: Emojis.Saw,
  disabled: false,
  shopType: "weapons",
  price: 28,
  damage: 34,
  uses: 70,
  weaponType: 'Melee',
  amountPerUser: 1,
  requires: []
} as Omit<Weapon, 'purchasedAt'>;
