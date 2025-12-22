import { useQuery, useMutation } from "@tanstack/react-query";
import { getProductAction } from "../actions/get-product.action";
import { createUpdateProductAction } from "@/admin/actions/create-update-product.action";
import { toast } from "sonner";

interface UseProductByProps {
  idSlug: string;
}

export const useProduct = ({ idSlug }: UseProductByProps) => {
  const query = useQuery({
    queryKey: ["product", idSlug],
    queryFn: () => getProductAction(idSlug),
    staleTime: 1000 * 60 * 5,
    enabled: !!idSlug && idSlug !== "new",
    retry: false
  });

  const createUpdateMutation = useMutation({
    mutationFn: createUpdateProductAction,
    onMutate: () => {
      toast.loading("Guardando producto...", {
        id: "product-create-update",
        richColors: true,
        position: "top-right"
      });
    }
  });

  return {
    ...query,
    createUpdateMutation: createUpdateMutation
  };
};
