import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { Product } from "@/types/product.interface";

export const getProductAction = async (id: string) => {
  const { data } = await tesloApi.get<ApiResponse<Product>>(`/products/${id}`);

  return data.data;
};
