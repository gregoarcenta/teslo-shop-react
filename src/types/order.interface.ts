export interface OrderPaginate {
  orders: Order[];
  totalOrders: number;
}

export interface Order {
  id: string;
  totalAmount: string;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  images: unknown[];
}

export type OrderStatus = "pending" | "delivered" | "cancelled";
