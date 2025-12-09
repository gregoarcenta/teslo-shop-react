import type { Category, Gender, Size } from "./enums";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  type: Category;
  gender: Gender;
  sizes: Size[];
  tags: string[];
  createdAt: string;
  createdBy: string;
  images: string[];
  isLiked: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
