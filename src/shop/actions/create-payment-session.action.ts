import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

type PaymentSessionResponse = {
  url: string;
};

export const createPaymentSessionAction = async (
  orderId: string
): Promise<string> => {
  const { data } = await tesloApi.post<ApiResponse<PaymentSessionResponse>>(
    `/payments/create-payment-session`,
    { orderId }
  );

  return data.data.url;
};
