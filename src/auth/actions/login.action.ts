import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { AuthResponse } from "@/types/auth.interface";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginAction = async ({ email, password }: LoginCredentials) => {
  const { data } = await tesloApi.post<ApiResponse<AuthResponse>>(
    "/auth/signin",
    { email, password }
  );
  return data.data;
};
