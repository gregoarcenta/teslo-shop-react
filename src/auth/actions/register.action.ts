import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { AuthResponse } from "@/types/auth.interface";

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export const registerAction = async ({
  fullName,
  email,
  password
}: RegisterCredentials) => {
  const { data } = await tesloApi.post<ApiResponse<AuthResponse>>(
    "/auth/signup",
    { fullName, email, password }
  );
  return data.data;
};
