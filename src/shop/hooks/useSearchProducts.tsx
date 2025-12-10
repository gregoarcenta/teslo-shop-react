import { useQuery } from "@tanstack/react-query";
import { getProductSuggestionAction } from "../actions/get-product-suggestions.action";

export const useSearchProducts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => getProductSuggestionAction(query),
    enabled: enabled && query.trim().length > 1,
    staleTime: 30 * 1000, // 30 segundos fresh
    gcTime: 5 * 60 * 1000 // 5 minutos en caché
  });
};
