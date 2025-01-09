import { WeaponShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Crossbow",
    plural: "Crossbows",
  },
  description: "A powerful ranged weapon, ideal for precision shooting.",
  icon: "🏹",
  disabled: false, 
  type: "weapon",
  price: 125,
  amountPerUser: 1,
  weaponType: "other",
  damage: 82,
  durability: "unlimited",
  requires: ['Arrows'] // enter NAMES of other items by their Sinular name to require them for this item to be used.
} as WeaponShopItem;
