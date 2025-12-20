import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

export const validateTokenSession = async (token: string): Promise<boolean> => {
  const { data } = await tesloApi.post<ApiResponse<boolean>>(
    `/payments/validate-token-session`,
    { token }
  );

  return data.data;
};
