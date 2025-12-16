import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { CartItem } from "@/types/cart.interface";

interface AddToCartPayload {
  productId: string;
  cartId: string;
}

export const addToCartAction = async ({
  productId,
  cartId
}: AddToCartPayload) => {
  const { data } = await tesloApi.post<ApiResponse<CartItem>>(`/cart/item`, {
    productId,
    cartId
  });

  return data.data;
};
