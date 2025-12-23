import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";

export const deleteImageAction = async (publicId: string): Promise<void> => {
  await tesloApi.delete<ApiResponse<void>>(`/files/product/image/${publicId}`);
};
