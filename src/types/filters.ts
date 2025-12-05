export const CATEGORY_LABELS: Record<string, string> = {
  SHIRTS: "Camisetas",
  PANTS: "Pantalones",
  HOODIES: "Sudaderas",
  HATS: "Gorras"
};

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
export const CATEGORY_OPTIONS = ["SHIRTS", "PANTS", "HOODIES", "HATS"];
export const DEFAULT_PRICE_RANGE = [0, 500] as const;

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Precio: Bajo a Alto" },
  { value: "price-desc", label: "Precio: Alto a Bajo" },
  { value: "newest", label: "Más Nuevos" }
] as const;
