import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { Category, Gender, Order, Size } from "@/types/enums";
import type { ProductsResponse } from "@/types/product.interface";

interface Options {
  limit?: number;
  page?: number;
  title?: string;
  gender?: Gender;
  type?: Category[];
  sizes: Size[];
  minPrice: number;
  maxPrice: number;
  order: Order;
}

export const getProductsAction = async (options: Options) => {
  const params = new URLSearchParams();

  params.append("page", (options.page || 1).toString());

  if (options.title) {
    params.append("title", options.title);
  }

  if (options.gender) {
    params.append("gender", options.gender);
  }

  if (options.type && options.type.length > 0) {
    options.type.forEach((type) => params.append("type", type));
  }

  if (options.sizes && options.sizes.length > 0) {
    options.sizes.forEach((size) => params.append("sizes", size));
  }

  if (options.minPrice) {
    params.append("minPrice", options.minPrice.toString());
  }

  if (options.maxPrice) {
    params.append("maxPrice", options.maxPrice.toString());
  }
  if (options.order) {
    params.append("order", options.order);
  }

  const { data } = await tesloApi.get<ApiResponse<ProductsResponse>>(
    "/products",
    {
      params
    }
  );

  return data.data;
};
