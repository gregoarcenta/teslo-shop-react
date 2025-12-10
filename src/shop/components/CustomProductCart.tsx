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

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

interface ProductCardProps {
  product: Product;
}

export const CustomProductCard = ({ product }: ProductCardProps) => {
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);
  const [isAnimatingCart, setIsAnimatingCart] = useState(false);

  const handleFavoriteClick = () => {
    // setIsFavorite(!isFavorite);
    setIsAnimatingHeart(true);
    setTimeout(() => setIsAnimatingHeart(false), 600);
    toast(product.isLiked ? "Eliminado de favoritos" : "Agregado a favoritos", {
      description: product.isLiked
        ? `${product.title} fue eliminado de tus favoritos`
        : `${product.title} fue agregado a tus favoritos`
    });
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
