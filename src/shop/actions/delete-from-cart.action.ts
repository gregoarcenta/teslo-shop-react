import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

interface AddToCartPayload {
  productId: string;
  cartId: string;
}

export const deleteFromCartAction = async ({
  productId,
  cartId
}: AddToCartPayload) => {
  const { data } = await tesloApi.delete<ApiResponse<null>>(`/cart/item`, {
    data: {
      productId,
      cartId
    }
  });

  return data.message;
};
