import { useParams, useNavigate } from "react-router";
import { useProduct } from "@/shop/hooks/useProduct";
import { AdminNotFound } from "../404/AdminNotFound";
import { ProductForm } from "./ui/ProductForm";
import type { Product } from "@/types/product.interface";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const AdminProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    createUpdateMutation,
    data: product
  } = useProduct({ idSlug: id || "" });

  const productTitle = id === "new" ? "Nuevo producto" : "Editar producto";
  const productSubtitle =
    id === "new"
      ? "Aquí puedes crear un nuevo producto."
      : "Aquí puedes editar el producto.";

  const handleSubmit = async (productLike: Product) => {
    const isNewProduct = id === "new";

    await createUpdateMutation.mutateAsync(productLike, {
      onSuccess: (product) => {
        // Actualizar el caché con los datos del producto
        queryClient.setQueryData(["product", product.id], product);

        // Invalidar lista de productos para refrescarla
        queryClient.invalidateQueries({
          queryKey: ["products"]
        });

        toast.success(
          isNewProduct
            ? "Producto creado correctamente"
            : "Producto actualizado correctamente",
          {
            id: "product-create-update",
            richColors: true,
            position: "top-right"
          }
        );

        if (isNewProduct) navigate(`/admin/products`);
      },
      onError: (error) => {
        toast.error(
          isNewProduct
            ? "Error al crear el producto"
            : "Error al actualizar el producto",
          {
            id: "product-create-update",
            richColors: true,
            position: "top-right"
          }
        );
        console.error("Error creating/updating product:", error);
      }
    });
  };

  if (isLoading) return <div>Cargando...</div>;

  if (isError) return <AdminNotFound />;

  return (
    <ProductForm
      title={productTitle}
      subtitle={productSubtitle}
      product={product}
      isLoadingSubmit={createUpdateMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
};
