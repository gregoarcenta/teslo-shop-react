import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useProductFilters } from "../hooks/useProductFilters";
import { SORT_OPTIONS } from "@/types/filters";

const CustomProductSortSelect = () => {
  const { sortBy, handleSortChange } = useProductFilters();

  return (
    <div className="flex items-center gap-4">
      <Label className="text-sm">Ordenar por:</Label>
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomProductSortSelect;
