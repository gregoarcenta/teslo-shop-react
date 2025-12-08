import { useState, useEffect, Activity } from "react";
import { ShoppingBag } from "lucide-react";
import tshirtWhite from "@/assets/tesla-tshirt-white.jpg";
import jacketBlack from "@/assets/tesla-jacket-black.jpg";
import hoodieGray from "@/assets/tesla-hoodie-gray.jpg";
import capBlack from "@/assets/tesla-cap-black.jpg";
import sweatshirtNavy from "@/assets/tesla-sweatshirt-navy.jpg";
import longsleeveCharcoal from "@/assets/tesla-longsleeve-charcoal.jpg";
import { useParams } from "react-router";
import { EmptyState } from "@/components/custom/EmptyState";
import { CustomProductCard } from "@/shop/components/CustomProductCart";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomProductGridSkeleton } from "@/shop/components/CustomProductGridSkeleton";
import CustomSidebarFilters from "@/shop/components/CustomSidebarFilters";
import CustomProductsToolbar from "@/shop/components/CustomProductToolbar";
import CustomActiveFilters from "@/shop/components/CustomActiveFilters";
import { useProductFilters } from "@/shop/hooks/useProductFilters";

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
  const { gender } = useParams<{ gender?: string }>();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { searchQuery, hasActiveFilters, handleClearFilters } =
    useProductFilters();

  // Simular carga de datos del backend
  useEffect(() => {
    setIsLoading(true);
    // Simular delay de carga (en producción esto sería una llamada real al backend)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts: any[] = mockProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 bg-primary/10 p-6 py-10 rounded-lg">
        <h1 className="text-4xl font-bold mb-2 font-montserrat">
          {gender === "men"
            ? "Ropa para Hombres"
            : gender === "women"
            ? "Ropa para Mujeres"
            : gender === "kids"
            ? "Ropa para Niños"
            : "Todos los Productos"}
        </h1>
        <p className="text-gray-600">
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
      <CustomActiveFilters />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <CustomSidebarFilters showFilters={showFilters} />

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <CustomProductsToolbar
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* Loading skeleton */}
          <Activity mode={isLoading ? "visible" : "hidden"}>
            <CustomProductGridSkeleton count={6} />
          </Activity>

          {/* Empty State */}
          <Activity
            mode={
              !isLoading && filteredProducts.length === 0 ? "visible" : "hidden"
            }
          >
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
          </Activity>

          {/* Products Grid */}
          <Activity
            mode={
              !isLoading && filteredProducts.length > 0 ? "visible" : "hidden"
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in mb-6">
              {filteredProducts.map((product) => (
                <CustomProductCard key={product.id} product={product} />
              ))}
            </div>
          </Activity>

          {/* Pagination */}
          {filteredProducts.length > 0 && <CustomPagination totalPages={6} />}
        </div>
      </div>
    </div>
  );
};
