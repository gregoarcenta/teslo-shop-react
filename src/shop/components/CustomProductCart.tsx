import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Link } from "react-router";
import type { Product } from "@/types/product.interface";
import { AddToCartButton } from "./CustomBtnAddProduct";
import { FavoriteButton } from "./CustomFavoriteButtom";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

interface ProductCardProps {
  product: Product;
}

export const CustomProductCard = ({ product }: ProductCardProps) => {
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
          <FavoriteButton product={product} variant="card" />
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
              <AddToCartButton product={product}></AddToCartButton>
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
