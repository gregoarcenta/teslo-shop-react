import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useProductFilters } from "../hooks/useProductFilters";
import { CATEGORY_OPTIONS, SIZE_OPTIONS } from "@/types/filters";

interface CustomSidebarFiltersProps {
  showFilters: boolean;
}

const CustomSidebarFilters = ({ showFilters }: CustomSidebarFiltersProps) => {
  const {
    selectedSizes,
    selectedCategories,
    selectedPriceRange,
    handleSizeChanged,
    handleCategoriesChanged,
    handlePriceRangeChanged,
    handleClearFilters
  } = useProductFilters();

  return (
    <aside
      className={`${
        showFilters ? "block" : "hidden"
      } lg:block w-full lg:w-64 shrink-0 space-y-6`}
    >
      <div className="bg-card rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Filtros</h2>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </div>

        {/* Category Filter */}
        <div className="space-y-3 mb-6">
          <Label>Categoría</Label>
          {CATEGORY_OPTIONS.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => handleCategoriesChanged(category.value)}
              />
              <label
                htmlFor={category.value}
                className="text-sm cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>

        {/* Price Range */}
        <div className="space-y-3 mb-6">
          <Label>Rango de Precio</Label>
          <Slider
            value={selectedPriceRange}
            onValueChange={handlePriceRangeChanged}
            min={0}
            max={500}
            step={10}
            minStepsBetweenThumbs={1}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${selectedPriceRange[0]}</span>
            <span>${selectedPriceRange[1]}</span>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <Label>Tallas</Label>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <Button
                key={size}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => handleSizeChanged(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CustomSidebarFilters;
