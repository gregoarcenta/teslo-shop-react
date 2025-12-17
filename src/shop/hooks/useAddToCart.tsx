import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartAction } from "../actions/add-to-cart.action";
import { toast } from "sonner";
import type { Cart } from "@/types/cart.interface";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartAction,

    onMutate: async ({ product, cartId }) => {
      toast.loading("Añadiendo producto al carrito...", {
        id: "add-to-cart"
      });

      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData(["cart"]) as
        | Cart
        | undefined;

      queryClient.setQueryData(["cart"], (old: Cart | undefined) => {
        const cart = old || { id: cartId, total: "0.00", cartItems: [] };

        const existingItemIndex = cart.cartItems.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...cart.cartItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };

          return {
            ...cart,
            total: (Number(cart.total) + Number(product.price)).toFixed(2),
            cartItems: updatedItems
          };
        }

        // Agregar nuevo
        return {
          ...cart,
          total: (Number(cart.total) + Number(product.price)).toFixed(2),
          cartItems: [
            ...cart.cartItems,
            {
              id: `temp-${Date.now()}`,
              product,
              quantity: 1
            }
          ]
        };
      });

      return { previousCart };
    },

    onSuccess: (cartItem) => {
      toast.success(
        `Añadido ${cartItem.quantity} x ${cartItem.product.title}`,
        { id: "add-to-cart" }
      );
      // queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Error al añadir el producto", { id: "add-to-cart" });
    }
  });
};
