import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { Cart } from "@/types/cart.interface";

export const getCartAction = async () => {
  const { data } = await tesloApi.get<ApiResponse<Cart>>(`/cart`);

  return data.data;
};
