import { WeaponShopItem } from "../../handler/types/Item";

export = {
  name: {
    singular: "Gun",
    plural: "Guns",
  },
  description: "Find some eneimies to shoot",
  icon: "🔫",
  disabled: false,
  type: "weapon",
  price: 125,
  amountPerUser: 1,
  weaponType: 'gun',
  damage: 82,
  durability: 'unlimited',
  requires: [] // enter NAMES of other items by their Sinular name to require them for this item to be used.
} as WeaponShopItem;
