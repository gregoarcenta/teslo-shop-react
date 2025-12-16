import { useQuery } from "@tanstack/react-query";
import { getCartAction } from "../actions/get-cart.action";
import { useAuthStore } from "@/auth/store/auth.store";

export const useCart = () => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartAction,
    enabled: authStatus === "authenticated",
    staleTime: 1000 * 60 * 5
  });
};
