import { Heart } from "lucide-react";
import { EmptyState } from "@/components/custom/EmptyState";
import { CustomProductCard } from "@/shop/components/CustomProductCart";
import { CustomProductCardSkeleton } from "@/shop/components/CustomProductGridSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getFavoritesAction } from "@/shop/actions/get-favorites.action";

// Mock favorites

export function FavoritesPage() {
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoritesAction,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // isLoading = true;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 font-montserrat">
          Mis Favoritos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CustomProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-montserrat">Mis Favoritos</h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No tienes productos favoritos aún"
          description="Explora nuestro catálogo y guarda tus productos favoritos aquí"
          actionLabel="Explorar Productos"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {favorites.map((product) => (
            <CustomProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
