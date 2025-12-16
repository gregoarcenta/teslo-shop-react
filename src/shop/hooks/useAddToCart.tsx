import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartAction } from "../actions/add-to-cart.action";
import { toast } from "sonner";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: addToCartAction,
    onMutate: () => {
      toast.loading("Añadiendo producto al carrito...", {
        richColors: true,
        id: "added-cart-item"
      });
    },
    onSuccess: (cartItem) => {
      toast.success(
        `Añadido ${cartItem.quantity} x ${cartItem.product.title} al carrito`,
        { richColors: true, id: "added-cart-item" }
      );
    },
    onError: () => {
      toast.error("Error al añadir el producto al carrito", {
        richColors: true,
        id: "added-cart-item"
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
};
