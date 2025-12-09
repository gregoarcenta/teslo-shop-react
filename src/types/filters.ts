import type { Category, Order, Size } from "./enums";

export const SIZE_OPTIONS: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "shirts", label: "Camisetas" },
  { value: "pants", label: "Pantalones" },
  { value: "hoodies", label: "Sudaderas" },
  { value: "hats", label: "Gorras" }
];
export const SORT_OPTIONS: { value: Order; label: string }[] = [
  { value: "price-asc", label: "Precio: Bajo a Alto" },
  { value: "price-desc", label: "Precio: Alto a Bajo" },
  { value: "newest", label: "Más Nuevos" }
];

export const DEFAULT_PRICE_RANGE = [0, 500] as const;
