import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/custom/EmptyState";
import { CustomProductCard } from "@/shop/components/CustomProductCart";
import { CustomProductGridSkeleton } from "@/shop/components/CustomProductGridSkeleton";
import type { Product } from "@/types/product.interface";

// Mock favorites
const mockFavorites: Product[] = [];

export function FavoritesPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de favoritos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 font-montserrat">
          Mis Favoritos
        </h1>
        <CustomProductGridSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-montserrat">Mis Favoritos</h1>

      {mockFavorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No tienes productos favoritos aún"
          description="Explora nuestro catálogo y guarda tus productos favoritos aquí"
          actionLabel="Explorar Productos"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {mockFavorites.map((product) => (
            <CustomProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
