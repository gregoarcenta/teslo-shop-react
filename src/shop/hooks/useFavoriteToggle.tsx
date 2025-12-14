import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleFavoriteAction } from "@/shop/actions/toggle-favorite.action";
import type { Product } from "@/types/product.interface";

export const useFavoriteToggle = (product: Product) => {
  const queryClient = useQueryClient();

  //   console.log(product);

  return useMutation({
    mutationFn: (productId: string) => toggleFavoriteAction(productId),

    onMutate: async (productId) => {
      const productsKey = ["products"];
      const favoritesKey = ["favorites"];
      const productKey = ["product"];

      // Cancelar queries
      await queryClient.cancelQueries({ queryKey: productsKey, exact: false });
      await queryClient.cancelQueries({ queryKey: favoritesKey, exact: false });
      await queryClient.cancelQueries({ queryKey: productKey, exact: false });

      // Guardar snapshots
      const previousProducts = queryClient.getQueriesData({
        queryKey: productsKey,
        exact: false
      });
      const previousProduct = queryClient.getQueriesData({
        queryKey: productKey,
        exact: false
      });
      const previousFavorites = queryClient.getQueryData(favoritesKey);

      // 1. Actualizar productos
      queryClient.setQueriesData(
        { queryKey: productsKey, exact: false },
        (old: any) => {
          if (old?.products && Array.isArray(old.products)) {
            return {
              ...old,
              products: old.products.map((p: any) =>
                p.id === productId ? { ...p, isLiked: !p.isLiked } : p
              )
            };
          }
          return old;
        }
      );

      // 2. Actualizar producto individual
      queryClient.setQueriesData(
        { queryKey: productKey, exact: false },
        (old: any) => {
          if (old?.id === productId) {
            return { ...old, isLiked: !old.isLiked };
          }
          return old;
        }
      );

      // 3. Actualizar favoritos
      queryClient.setQueryData(favoritesKey, (old: any) => {
        if (!Array.isArray(old)) return old;

        const exists = old.some((p: any) => p.id === productId);

        if (exists) {
          return old.filter((p: any) => p.id !== productId);
        } else {
          return [...old, { ...product, isLiked: true }];
        }
      });

      return { previousProducts, previousFavorites, previousProduct };
    },

    onSuccess: (response) => {
      const successMessage = response.includes("added")
        ? `${product.title} fue agregado a favoritos`
        : `${product.title} fue eliminado de favoritos`;

      toast.success(successMessage);

      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["product"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["favorites"], exact: false });
    },

    onError: (error, _, context) => {
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousProduct) {
        context.previousProduct.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }

      toast.error("Error al actualizar favoritos");
      console.error("Favorite mutation error:", error);
    }
  });
};
