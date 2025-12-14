import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Link } from "react-router";
import type { Product } from "@/types/product.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoriteAction } from "../actions/toggle-favorite.action";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

interface ProductCardProps {
  product: Product;
}

export const CustomProductCard = ({ product }: ProductCardProps) => {
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);
  const [isAnimatingCart, setIsAnimatingCart] = useState(false);

  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: (productId: string) => toggleFavoriteAction(productId),
    //Optimistic Update
    onMutate: async (productId: string) => {
      const productsKey = ["products"];
      const favoritesKey = ["favorites"];

      // Cancelar todas las queries de productos
      await queryClient.cancelQueries({ queryKey: productsKey, exact: false });
      await queryClient.cancelQueries({ queryKey: favoritesKey, exact: false });

      // Guardar data anterior
      const previousProducts = queryClient.getQueriesData({
        queryKey: productsKey,
        exact: false
      });
      const previousFavorites = queryClient.getQueryData(favoritesKey);

      // Actualizar query de productos
      queryClient.setQueriesData(
        { queryKey: productsKey, exact: false },
        (old: any) => {
          // Si la query devuelve un objeto con productos
          if (old?.products && Array.isArray(old.products)) {
            return {
              ...old,
              products: old.products.map((p: any) =>
                p.id === productId ? { ...p, isLiked: !p.isLiked } : p
              )
            };
          }

          // Si la query devuelve directamente un array
          if (Array.isArray(old)) {
            return old.map((p: any) =>
              p.id === productId ? { ...p, isLiked: !p.isLiked } : p
            );
          }

          return old;
        }
      );

      // Actualizar query de favoritos
      queryClient.setQueryData(favoritesKey, (old: any) => {
        if (!Array.isArray(old)) return old;

        const exists = old.some((p: any) => p.id === productId);

        if (exists) {
          // Quitar de favoritos
          return old.filter((p: any) => p.id !== productId);
        } else {
          // Agregar a favoritos
          return [...old, { ...product, isLiked: true }];
        }
      });

      return { previousProducts, previousFavorites };
    },
    onSuccess: (response) => {
      const successMessage = response.includes("added")
        ? `${product.title} fue agregado a favoritos`
        : `${product.title} fue eliminado de favoritos`;

      toast.success(successMessage);

      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["favorites"], exact: false });
    },
    onError: (error, _, context) => {
      // Revertir productos
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      // Revertir favoritos
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
      toast.error("Error al actualizar favoritos");
      console.error("Favorite mutation error:", error);
    }
  });

  const handleFavoriteClick = () => {
    if (favoriteMutation.isPending) return;

    setIsAnimatingHeart(true);
    setTimeout(() => setIsAnimatingHeart(false), 600);

    favoriteMutation.mutate(product.id);
  };

  const handleAddToCart = () => {
    setIsAnimatingCart(true);
    setTimeout(() => setIsAnimatingCart(false), 600);

    toast("Producto agregado", {
      description: `${product.title} fue agregado a tu carrito`
    });
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-secondary/30">
          <img
            src={
              product.images.length
                ? IMAGE_BASE_URL + product.images[0]
                : "/no-image.png"
            }
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            crossOrigin="anonymous"
          />
        </div>
      </Link>

      {/* Favorite Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm hover:bg-primary/10 hover:scale-110 shadow-soft border border-border/50 transition-all duration-200"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                product.isLiked
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              } ${isAnimatingHeart ? "animate-heart-like" : ""}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {product.isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ${product.price}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="gradient-hero shadow-soft"
                onClick={handleAddToCart}
              >
                <ShoppingBag
                  className={`h-4 w-4 mr-1 transition-all ${
                    isAnimatingCart ? "animate-cart-bounce" : ""
                  }`}
                />
                Agregar
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Agregar al carrito</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {product.stock < 5 && product.stock > 0 && (
          <p className="text-xs text-accent mt-2">
            ¡Solo quedan {product.stock} en stock!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-destructive mt-2">Agotado</p>
        )}
      </div>
    </div>
  );
};
