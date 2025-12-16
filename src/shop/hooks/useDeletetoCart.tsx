import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFromCartAction } from "../actions/delete-from-cart.action";
import { toast } from "sonner";

export const useDeleteFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-from-cart"],
    mutationFn: deleteFromCartAction,
    onMutate: () => {
      toast.loading("Eliminando producto del carrito...", {
        richColors: true,
        id: "delete-cart-item"
      });
    },
    onSuccess: (_) => {
      toast.success(`Producto eliminado del carrito.`, {
        richColors: true,
        id: "delete-cart-item"
      });
    },
    onError: () => {
      toast.error("Error al eliminar el producto del carrito", {
        richColors: true,
        id: "delete-cart-item"
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
};
