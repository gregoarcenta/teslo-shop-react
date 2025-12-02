import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X, ShoppingBag } from "lucide-react";
import tshirtWhite from "@/assets/tesla-tshirt-white.jpg";
import jacketBlack from "@/assets/tesla-jacket-black.jpg";
import hoodieGray from "@/assets/tesla-hoodie-gray.jpg";
import capBlack from "@/assets/tesla-cap-black.jpg";
import sweatshirtNavy from "@/assets/tesla-sweatshirt-navy.jpg";
import longsleeveCharcoal from "@/assets/tesla-longsleeve-charcoal.jpg";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { EmptyState } from "@/components/custom/EmptyState";
import { CustomProductGridSkeleton } from "@/shop/components/CustomproductGridSkeleton";
import { CustomProductCard } from "@/shop/components/CustomProductCart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CustomPagination } from "@/components/custom/CustomPagination";

// Mock data - this will be replaced with real data from database
const mockProducts = [
  {
    id: "1",
    name: "Camiseta Tesla Wordmark",
    description: "Camiseta blanca con el icónico logo de Tesla",
    price: 35.0,
    type: "men",
    gender: "masculine",
    sizes: ["S", "M", "L", "XL"],
    tags: ["casual", "camiseta", "tesla"],
    stock: 15,
    imageUrl: tshirtWhite
  },
  {
    id: "2",
    name: "Chaqueta Tesla Premium",
    description: "Chaqueta negra con capucha y logo Tesla",
    price: 150.0,
    type: "men",
    gender: "masculine",
    sizes: ["S", "M", "L", "XL"],
    tags: ["abrigo", "premium", "tesla"],
    stock: 8,
    imageUrl: jacketBlack
  },
  {
    id: "3",
    name: "Sudadera Tesla Gris",
    description: "Sudadera con capucha color gris con logo Tesla",
    price: 65.0,
    type: "men",
    gender: "masculine",
    sizes: ["S", "M", "L", "XL"],
    tags: ["sudadera", "casual", "tesla"],
    stock: 20,
    imageUrl: hoodieGray
  },
  {
    id: "4",
    name: "Gorra Tesla Icon",
    description: "Gorra negra con logo Tesla bordado",
    price: 30.0,
    type: "men",
    gender: "masculine",
    sizes: ["única"],
    tags: ["gorra", "accesorio", "tesla"],
    stock: 25,
    imageUrl: capBlack
  },
  {
    id: "5",
    name: "Sudadera Tesla Navy",
    description: "Sudadera azul marino con logo Tesla",
    price: 60.0,
    type: "women",
    gender: "feminine",
    sizes: ["S", "M", "L", "XL"],
    tags: ["sudadera", "casual", "tesla"],
    stock: 12,
    imageUrl: sweatshirtNavy
  },
  {
    id: "6",
    name: "Camiseta Manga Larga Tesla",
    description: "Camiseta de manga larga color carbón con logo Tesla",
    price: 45.0,
    type: "men",
    gender: "masculine",
    sizes: ["S", "M", "L", "XL"],
    tags: ["camiseta", "manga larga", "tesla"],
    stock: 18,
    imageUrl: longsleeveCharcoal
  }
];

export const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { gender } = useParams<{ gender?: string }>();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = searchParams.get("search") || "";

  // Simular carga de datos del backend
  useEffect(() => {
    setIsLoading(true);
    // Simular delay de carga (en producción esto sería una llamada real al backend)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gender, searchQuery]);

  // Mapear género de la ruta al tipo de producto
  const genderType =
    gender === "men"
      ? "men"
      : gender === "women"
      ? "women"
      : gender === "kids"
      ? "kids"
      : null;

  // Filtrar productos basado en búsqueda y filtros
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filtro de búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filtro de tipo basado en la ruta
    if (genderType) {
      filtered = filtered.filter((p) => p.type === genderType);
    }

    // Filtro de categorías (basado en tags)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.some((cat) =>
          p.tags.some((tag) => tag.toLowerCase().includes(cat.toLowerCase()))
        )
      );
    }

    // Filtro de tallas
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    // Filtro de precio
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Ordenar (solo si se ha seleccionado una opción)
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.reverse();
          break;
      }
    }

    return filtered;
  }, [
    searchQuery,
    genderType,
    selectedCategories,
    selectedSizes,
    priceRange,
    sortBy
  ]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setSortBy("");
    const basePath = gender ? `/products/${gender}` : "/products";
    navigate(basePath);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 500 ||
    searchQuery.trim() !== "";

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "category":
        setSelectedCategories(selectedCategories.filter((c) => c !== value));
        break;
      case "size":
        setSelectedSizes(selectedSizes.filter((s) => s !== value));
        break;
      case "search":
        const basePath = gender ? `/products/${gender}` : "/products";
        navigate(basePath);
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {gender === "men"
            ? "Ropa para Hombres"
            : gender === "women"
            ? "Ropa para Mujeres"
            : gender === "kids"
            ? "Ropa para Niños"
            : "Todos los Productos"}
        </h1>
        <p className="text-muted-foreground">
          {gender
            ? `Explora nuestra colección para ${gender}`
            : "Descubre nuestra colección completa"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </p>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Filtros activos:</span>
          {searchQuery.trim() && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: {searchQuery}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter("search", "")}
              />
            </Badge>
          )}
          {selectedCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat === "SHIRTS"
                ? "Camisetas"
                : cat === "PANTS"
                ? "Pantalones"
                : cat === "HOODIES"
                ? "Sudaderas"
                : "Gorras"}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter("category", cat)}
              />
            </Badge>
          ))}
          {selectedSizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1">
              Talla: {size}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter("size", size)}
              />
            </Badge>
          ))}
          {(priceRange[0] !== 0 || priceRange[1] !== 500) && (
            <Badge variant="secondary" className="gap-1">
              Precio: ${priceRange[0]} - ${priceRange[1]}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setPriceRange([0, 500])}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7"
          >
            Limpiar todos
          </Button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
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
              {["SHIRTS", "PANTS", "HOODIES", "HATS"].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      setSelectedCategories(
                        checked
                          ? [...selectedCategories, category]
                          : selectedCategories.filter((c) => c !== category)
                      );
                    }}
                  />
                  <label htmlFor={category} className="text-sm cursor-pointer">
                    {category === "SHIRTS"
                      ? "Camisetas"
                      : category === "PANTS"
                      ? "Pantalones"
                      : category === "HOODIES"
                      ? "Sudaderas"
                      : "Gorras"}
                  </label>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="space-y-3 mb-6">
              <Label>Rango de Precio</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500}
                step={10}
                minStepsBetweenThumbs={1}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <Label>Tallas</Label>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button
                    key={size}
                    variant={
                      selectedSizes.includes(size) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedSizes(
                        selectedSizes.includes(size)
                          ? selectedSizes.filter((s) => s !== size)
                          : [...selectedSizes, size]
                      );
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Ocultar" : "Mostrar"} Filtros
              </Button>
              {showFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <Label className="text-sm">Ordenar por:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Precio: Bajo a Alto</SelectItem>
                  <SelectItem value="price-desc">
                    Precio: Alto a Bajo
                  </SelectItem>
                  <SelectItem value="newest">Más Nuevos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <CustomProductGridSkeleton count={6} />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredProducts.map((product) => (
                <CustomProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <EmptyState
              icon={ShoppingBag}
              title="No se encontraron productos"
              description={
                searchQuery.trim()
                  ? `No hay productos que coincidan con "${searchQuery}"`
                  : "No hay productos disponibles con los filtros seleccionados"
              }
              actionLabel={
                hasActiveFilters ? "Limpiar todos los filtros" : undefined
              }
              onAction={hasActiveFilters ? handleClearFilters : undefined}
            />
          )}

          <CustomPagination totalPages={6} />
        </div>
      </div>
    </div>
  );
};
