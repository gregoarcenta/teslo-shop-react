import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { CartItem } from "@/types/cart.interface";
import type { Product } from "@/types/product.interface";

interface AddToCartPayload {
  product: Product;
  cartId: string;
}

export const addToCartAction = async ({
  product,
  cartId
}: AddToCartPayload) => {
  const { data } = await tesloApi.post<ApiResponse<CartItem>>(`/cart/item`, {
    productId: product.id,
    cartId
  });

  return data.data;
};
