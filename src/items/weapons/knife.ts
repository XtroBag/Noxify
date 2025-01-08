import { WeaponShopItem } from "../../handler/types/Item";

export = {
  name: "Knife",
  description: "A sharp weapon for close combat.",
  icon: "🔪",
  disabled: false,
  type: "weapon",
  price: 11,
  damage: 27,
  durability: 'unlimited',
  weaponType: 'knife',
  amountPerUser: 1
} as WeaponShopItem;
