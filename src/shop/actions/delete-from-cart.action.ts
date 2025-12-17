import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

export interface DeleteFromCartPayload {
  productId: string;
  cartId: string;
}

export const deleteFromCartAction = async ({
  productId,
  cartId
}: DeleteFromCartPayload) => {
  const { data } = await tesloApi.delete<ApiResponse<null>>(`/cart/item`, {
    data: {
      productId,
      cartId
    }
  });

  return data.message;
};
