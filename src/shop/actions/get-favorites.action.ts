import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { Product } from "@/types/product.interface";

export const getFavoritesAction = async () => {
  const { data } = await tesloApi.get<ApiResponse<Product[]>>(`/favorites`);

  return data.data;
};
