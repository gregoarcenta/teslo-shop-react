import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";
import { useProductFilters } from "./useProductFilters";
import { useParams, useSearchParams } from "react-router";
import type { Category, Gender, Order, Size } from "@/types/enums";

export const useProducts = () => {
  let { gender } = useParams();
  if (gender === "kids") gender = "kid";

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const {
    searchQuery: title,
    selectedCategories: type,
    selectedSizes: sizes,
    selectedPriceRange: price,
    sortBy: order
  } = useProductFilters();

  return useQuery({
    queryKey: ["products", { page, title, gender, type, sizes, price, order }],
    queryFn: () =>
      getProductsAction({
        page,
        title,
        gender: gender as Gender,
        type: type as Category[],
        sizes: sizes as Size[],
        minPrice: price[0],
        maxPrice: price[1],
        order: order as Order
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};
