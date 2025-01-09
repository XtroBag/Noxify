import { WeaponShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Bomb",
    plural: "Bombs",
  },
  description: "A very explosive and dangerous weapon",
  icon: "💣",
  disabled: false,
  type: "weapon",
  price: 9,
  amountPerUser: 15,
  weaponType: 'other',
  damage: 54,
  durability: 1,
  requires: [] // enter NAMES of other items by their Sinular name to require them for this item to be used.
} as WeaponShopItem;
