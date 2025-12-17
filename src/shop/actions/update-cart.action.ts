import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { CartItem } from "@/types/cart.interface";
import type { Product } from "@/types/product.interface";

export interface UpdateCartPayload {
  product: Product;
  cartId: string;
  quantity: number;
}

export const updateCartAction = async ({
  product,
  cartId,
  quantity
}: UpdateCartPayload) => {
  const { data } = await tesloApi.patch<ApiResponse<CartItem>>(`/cart/item`, {
    productId: product.id,
    cartId,
    quantity
  });

  return data.data;
};
