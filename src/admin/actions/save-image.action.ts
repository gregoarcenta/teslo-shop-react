import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

interface ImageResponse {
  public_id: string;
  format: string;
}

export const saveImageAction = async (file: File): Promise<ImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await tesloApi.post<ApiResponse<ImageResponse>>(
    "/files/product/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data.data;
};
