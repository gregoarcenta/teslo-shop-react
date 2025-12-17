import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFromCartAction } from "../actions/delete-from-cart.action";
import { toast } from "sonner";
import type { Cart } from "@/types/cart.interface";

export const useDeleteFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-from-cart"],
    mutationFn: deleteFromCartAction,
    onMutate: async ({ productId }) => {
      toast.loading("Eliminando producto...", { id: "delete-cart" });

      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData(["cart"]) as
        | Cart
        | undefined;

      queryClient.setQueryData(["cart"], (old: Cart | undefined) => {
        if (!old) return old;

        const itemToRemove = old.cartItems.find(
          (item) => item.product.id === productId
        );

        if (!itemToRemove) return old;

        const newTotal = (
          Number(old.total) -
          Number(itemToRemove.product.price) * itemToRemove.quantity
        ).toFixed(2);

        return {
          ...old,
          total: newTotal,
          cartItems: old.cartItems.filter(
            (item) => item.product.id !== productId
          )
        };
      });

      return { previousCart };
    },
    onSuccess: (_) => {
      toast.success("Producto eliminado", { id: "delete-cart" });
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Error al eliminar el producto", { id: "delete-cart" });
    }
  });
};
