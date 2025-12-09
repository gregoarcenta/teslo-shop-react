import { useState, Activity } from "react";
import { ShoppingBag } from "lucide-react";
import { useParams } from "react-router";
import { EmptyState } from "@/components/custom/EmptyState";
import { CustomProductCard } from "@/shop/components/CustomProductCart";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomProductGridSkeleton } from "@/shop/components/CustomProductGridSkeleton";
import CustomSidebarFilters from "@/shop/components/CustomSidebarFilters";
import CustomProductsToolbar from "@/shop/components/CustomProductToolbar";
import CustomActiveFilters from "@/shop/components/CustomActiveFilters";
import { useProductFilters } from "@/shop/hooks/useProductFilters";
import { useProducts } from "@/shop/hooks/useProducts";
import type { Product } from "@/types/product.interface";

export const ProductsPage = () => {
  const { gender } = useParams<{ gender?: string }>();
  const [showFilters, setShowFilters] = useState(false);

  const { searchQuery, hasActiveFilters, handleClearFilters } =
    useProductFilters();

  const { data, isLoading } = useProducts();

  const filteredProducts: Product[] = data?.products || [];

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
          {data?.total}{" "}
          {data?.total === 1 ? "producto encontrado" : "productos encontrados"}
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
          {filteredProducts.length > 0 && (
            <CustomPagination totalPages={data?.totalPages || 1} />
          )}
        </div>
      </div>
    </div>
  );
};
