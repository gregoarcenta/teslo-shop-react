import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { AuthResponse } from "@/types/auth.interface";

export const checkStatusAction = async () => {
  const { data } = await tesloApi.get<ApiResponse<AuthResponse>>(
    "/auth/check-status",
    {}
  );
  return data.data;
};
