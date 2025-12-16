import type { Product } from "./product.interface";

export interface Cart {
  id: string;
  total: string;
  cartItems: CartItem[];
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}
