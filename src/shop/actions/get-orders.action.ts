import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { OrderPaginate } from "@/types/order.interface";

export const getOrdersAction = async (): Promise<OrderPaginate> => {
  const { data } = await tesloApi.get<ApiResponse<OrderPaginate>>(
    `/orders/user`,
    {
      params: {
        limit: 20
      }
    }
  );

  return data.data;
};
