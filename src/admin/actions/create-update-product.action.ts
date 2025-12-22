import { tesloApi } from "@/api/teslo-api";
import type { ApiResponse } from "@/types/api-response";
import type { Product } from "@/types/product.interface";

const cleanProductData = (product: Partial<Product>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, createdBy, isLiked, ...rest } = product;

  // Eliminar campos vacíos, null, undefined o strings vacíos
  const cleanedProduct = Object.entries(rest).reduce((acc, [key, value]) => {
    // Validar que el valor no sea vacío
    if (value === null || value === undefined || value === "") {
      return acc;
    }

    // Si es un array, verificar que no esté vacío
    if (Array.isArray(value) && value.length === 0) {
      return acc;
    }

    // Si es un objeto, verificar que no esté vacío
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return acc;
    }

    // Agregar solo valores válidos
    acc[key] = value;
    return acc;
  }, {} as Record<string, unknown>);

  return cleanedProduct;
};

export const createUpdateProductAction = async (
  product: Partial<Product>
): Promise<Product> => {
  const isUpdate = !!product.id;
  const productToSave = cleanProductData(product);

  const endpoint = isUpdate ? `/products/${product.id}` : `/products`;
  const method = isUpdate ? "patch" : "post";

  const { data } = await tesloApi[method]<ApiResponse<Product>>(
    endpoint,
    productToSave
  );

  return data.data;
};
