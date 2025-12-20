import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { Order } from "@/types/order.interface";

export const createOrderAction = async (): Promise<string> => {
  const { data } = await tesloApi.post<ApiResponse<Order>>(`/orders`);

  return data.data.id;
};
