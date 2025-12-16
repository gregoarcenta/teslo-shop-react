// components/FavoriteButton.tsx
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";
import type { Product } from "@/types/product.interface";
import { useFavoriteToggle } from "../hooks/useFavoriteToggle";

interface FavoriteButtonProps {
  product: Product;
  variant?: "card" | "page";
  size?: "sm" | "lg" | "icon";
  className?: string;
}

export const FavoriteButton = ({
  product,
  variant = "card",
  size = "icon",
  className = ""
}: FavoriteButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const authStatus = useAuthStore((state) => state.authStatus);
  const { isPending, mutate: toggleFavorite } = useFavoriteToggle(product);

  const handleClick = () => {
    if (isPending) return;

    if (authStatus === "not-authenticated") {
      toast.info("Debes iniciar sesión para gestionar favoritos", {
        description: "Inicia sesión o crea una cuenta para continuar",
        richColors: true
      });
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    toggleFavorite(product.id);
  };

  const baseClasses = ` bg-card/90 backdrop-blur-sm hover:bg-primary/10 hover:scale-110 shadow-soft border border-border/50 transition-all duration-200 ${
    variant === "card" ? "absolute top-2 right-2" : ""
  }`;

  return (
    <Button
      variant={variant === "card" ? "ghost" : "outline"}
      size={size}
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          product.isLiked
            ? "fill-destructive text-destructive"
            : "text-muted-foreground"
        } ${isAnimating ? "animate-heart-like" : ""}`}
      />
    </Button>
  );
};
