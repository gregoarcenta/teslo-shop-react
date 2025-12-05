import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useProductFilters } from "../hooks/useProductFilters";
import { CATEGORY_LABELS } from "@/types/filters";

const CustomActiveFilters = () => {
  const {
    searchQuery,
    selectedCategories,
    selectedSizes,
    selectedPriceRange,
    hasActiveFilters,
    removeFilter,
    handleClearFilters
  } = useProductFilters();

  if (!hasActiveFilters) {
    return null;
  }

  const isPriceRangeActive =
    selectedPriceRange[0] !== 0 || selectedPriceRange[1] !== 500;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Filtros activos:</span>

      {/* Search Query Badge */}
      {searchQuery.trim() && (
        <Badge variant="secondary" className="gap-1">
          Búsqueda: {searchQuery}
          <button
            type="button"
            onClick={() => removeFilter("search", "")}
            className="ml-0.5 p-0.5 cursor-pointer rounded-sm hover:bg-destructive/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {/* Category Badges */}
      {selectedCategories.map((cat) => (
        <Badge key={cat} variant="secondary" className="gap-1">
          {CATEGORY_LABELS[cat] || cat}
          <button
            type="button"
            onClick={() => removeFilter("category", cat)}
            className="ml-0.5 p-0.5 cursor-pointer rounded-sm hover:bg-destructive/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Size Badges */}
      {selectedSizes.map((size) => (
        <Badge key={size} variant="secondary" className="gap-1">
          Talla: {size}
          <button
            type="button"
            onClick={() => removeFilter("size", size)}
            className="ml-0.5 p-0.5 cursor-pointer rounded-sm hover:bg-destructive/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Price Range Badge */}
      {isPriceRangeActive && (
        <Badge variant="secondary" className="gap-1">
          Precio: ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
          <button
            type="button"
            onClick={() => removeFilter("priceRange", "")}
            className="ml-0.5 p-0.5 cursor-pointerrounded-sm hover:bg-destructive/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {/* Clear All Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearFilters}
        className="h-7"
      >
        Limpiar todos
      </Button>
    </div>
  );
};

export default CustomActiveFilters;
