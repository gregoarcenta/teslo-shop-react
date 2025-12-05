import { DEFAULT_PRICE_RANGE } from "@/types/filters";
import { useSearchParams } from "react-router";

interface UseProductFiltersReturn {
  selectedSizes: string[];
  selectedCategories: string[];
  selectedPriceRange: number[];
  sortBy: string;
  searchQuery: string;
  hasActiveFilters: boolean;
  handleSizeChanged: (size: string) => void;
  handleCategoriesChanged: (category: string) => void;
  handlePriceRangeChanged: (range: number[]) => void;
  handleSortChange: (value: string) => void;
  handleSearchChange: (query: string) => void;
  removeFilter: (type: string, value: string) => void;
  handleClearFilters: () => void;
}

export const useProductFilters = (): UseProductFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Obtener valores actuales de los filtros
  const selectedSizes =
    searchParams.get("sizes")?.split(",").filter(Boolean) || [];
  const selectedCategories =
    searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const selectedPriceRange = [
    ...(searchParams.get("priceRange")?.split(",").map(Number) ??
      DEFAULT_PRICE_RANGE)
  ];

  const sortBy = searchParams.get("sortBy") || "newest";
  const searchQuery = searchParams.get("search") || "";

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedPriceRange[0] !== 0 ||
    selectedPriceRange[1] !== 500 ||
    searchQuery.trim() !== "";

  const handleSizeChanged = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    searchParams.delete("page");

    if (newSizes.length > 0) {
      searchParams.set("sizes", newSizes.join(","));
    } else {
      searchParams.delete("sizes");
    }

    setSearchParams(searchParams);
  };

  const handleCategoriesChanged = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    searchParams.delete("page");

    if (newCategories.length > 0) {
      searchParams.set("categories", newCategories.join(","));
    } else {
      searchParams.delete("categories");
    }

    setSearchParams(searchParams);
  };

  const handlePriceRangeChanged = (range: number[]) => {
    searchParams.delete("page");
    searchParams.set("priceRange", `${range[0]},${range[1]}`);
    setSearchParams(searchParams);
  };

  const handleSortChange = (value: string) => {
    searchParams.delete("page");
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  };

  const handleSearchChange = (query: string) => {
    searchParams.delete("page");

    if (query.trim()) {
      searchParams.set("search", query);
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  };

  const removeFilter = (type: string, value: string) => {
    searchParams.delete("page");

    switch (type) {
      case "search":
        searchParams.delete("search");
        break;
      case "category":
        handleCategoriesChanged(value);
        return; // Ya actualiza searchParams
      case "size":
        handleSizeChanged(value);
        return; // Ya actualiza searchParams
      case "priceRange":
        searchParams.set("priceRange", "0,500");
        break;
    }

    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    searchParams.delete("sizes");
    searchParams.delete("categories");
    searchParams.delete("priceRange");
    searchParams.delete("sortBy");
    searchParams.delete("search");
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  return {
    selectedSizes,
    selectedCategories,
    selectedPriceRange,
    sortBy,
    searchQuery,
    hasActiveFilters,
    handleSizeChanged,
    handleCategoriesChanged,
    handlePriceRangeChanged,
    handleSortChange,
    handleSearchChange,
    removeFilter,
    handleClearFilters
  };
};
