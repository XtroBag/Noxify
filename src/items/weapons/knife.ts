import { WeaponShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: 'Knife',
    plural: 'Knives'
  },
  description: "A sharp weapon for close combat.",
  icon: "🔪",
  disabled: false,
  type: "weapon",
  price: 11,
  damage: 14,
  durability: 200,
  weaponType: 'other',
  amountPerUser: 1,
  requires: [] // enter NAMES of other items by their Sinular name to require them for this item to be used.
} as WeaponShopItem;
