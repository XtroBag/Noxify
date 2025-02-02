import { WeaponShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: 'Saw',
    plural: 'Saws'
  },
  description: "A durable tool for slicing through tough opponents.",
  icon: "🪚",
  disabled: false,
  type: "weapon",
  price: 28,
  damage: 34,
  durability: 70,
  weaponType: 'other',
  amountPerUser: 1,
  requires: [] // enter NAMES of other items by their Sinular name to require them for this item to be used.
} as WeaponShopItem;
