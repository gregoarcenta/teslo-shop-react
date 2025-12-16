// components/AddToCartButton.tsx
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";
import type { Product } from "@/types/product.interface";
import { useCart } from "../hooks/useCart";
import { useAddToCart } from "../hooks/useAddToCart";

interface AddToCartButtonProps {
  product: Product;
  size?: "sm" | "lg" | "default";
  className?: string;
  children?: React.ReactNode;
}

export const AddToCartButton = ({
  product,
  size = "sm",
  className = "gradient-hero shadow-soft",
  children
}: AddToCartButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const authStatus = useAuthStore((state) => state.authStatus);
  const { data: cart } = useCart();
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleClick = () => {
    if (isPending) return;

    if (authStatus === "not-authenticated") {
      toast.info("Debes iniciar sesión para agregar productos al carrito", {
        description: "Inicia sesión o crea una cuenta para continuar",
        richColors: true
      });
      return;
    }

    if (!cart?.id) {
      toast.error(
        "No se pudo agregar al carrito. Intenta nuevamente más tarde.",
        {
          richColors: true
        }
      );
      return;
    }

    if (product.stock === 0) {
      toast.error("No se pudo agregar al carrito. El producto está agotado.", {
        richColors: true
      });
      return;
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.id === product.id
    );
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error(
        `No se pudo agregar al carrito. Solo quedan ${product.stock} unidades disponibles.`,
        { richColors: true }
      );
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    addToCart({ productId: product.id, cartId: cart.id });
  };

  return (
    <Button
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isPending || product.stock === 0}
    >
      <ShoppingBag
        className={`h-4 w-4 mr-${children ? "2" : "1"} transition-all ${
          isAnimating ? "animate-cart-bounce" : ""
        }`}
      />
      {children || "Agregar"}
    </Button>
  );
};
