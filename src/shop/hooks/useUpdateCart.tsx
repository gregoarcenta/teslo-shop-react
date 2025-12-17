import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartAction } from "../actions/update-cart.action";
import type { Cart } from "@/types/cart.interface";
import { toast } from "sonner";

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-cart"],
    mutationFn: updateCartAction,
    onMutate: async ({ product, quantity }) => {
      const productId = product.id;

      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData(["cart"]) as
        | Cart
        | undefined;

      queryClient.setQueryData(["cart"], (old: Cart | undefined) => {
        if (!old) return old;

        const item = old.cartItems.find((i) => i.product.id === productId);
        if (!item) return old;

        const quantityDiff = quantity - item.quantity;
        const priceDiff = Number(item.product.price) * quantityDiff;

        return {
          ...old,
          total: (Number(old.total) + priceDiff).toFixed(2),
          cartItems: old.cartItems.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          )
        };
      });

      return { previousCart };
    },

    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Error al actualizar cantidad");
    }
  });
};
