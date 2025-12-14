import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

export const toggleFavoriteAction = async (productId: string) => {
  const { data } = await tesloApi.post<ApiResponse<undefined>>(`/favorites`, {
    productId
  });

  return data.message;
};
