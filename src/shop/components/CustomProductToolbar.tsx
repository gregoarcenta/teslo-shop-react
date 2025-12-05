import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import CustomProductSortSelect from "./CustomProductSortSelect";

interface ProductsToolbarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

const CustomProductsToolbar = ({
  showFilters,
  onToggleFilters
}: ProductsToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Ocultar" : "Mostrar"} Filtros
        </Button>
      </div>

      <div className="ml-auto">
        <CustomProductSortSelect />
      </div>
    </div>
  );
};

export default CustomProductsToolbar;
