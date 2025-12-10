import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { ProductSuggestionResponse } from "@/types/product.interface";

export const getProductSuggestionAction = async (query: string) => {
  const { data } = await tesloApi.get<ApiResponse<ProductSuggestionResponse[]>>(
    `/products/search/suggestions`,
    {
      params: { query, limit: 5 }
    }
  );

  return data.data;
};
