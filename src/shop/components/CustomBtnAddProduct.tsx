// components/AddToCartButton.tsx
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";
import type { Product } from "@/types/product.interface";
import { useCart } from "../hooks/useCart";
import { useAddToCart } from "../hooks/useAddToCart";
import { useUpdateCart } from "../hooks/useUpdateCart";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: "sm" | "lg" | "default";
  className?: string;
  children?: React.ReactNode;
}

export const AddToCartButton = ({
  product,
  quantity = 1,
  size = "sm",
  className = "gradient-hero shadow-soft",
  children
}: AddToCartButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const authStatus = useAuthStore((state) => state.authStatus);
  const { data: cart } = useCart();
  const { mutate: addToCart, isPending } = useAddToCart();
  const { mutate: updateQuantity, isPending: isUpdatingCart } = useUpdateCart();

  const handleClick = () => {
    if (isPending || isUpdatingCart) return;

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

    const totalQuantity = (cartItem?.quantity || 0) + quantity;

    if (totalQuantity > product.stock) {
      toast.error(
        `No se pudo agregar al carrito. Solo quedan ${product.stock} unidades disponibles.`,
        { richColors: true }
      );
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    if (quantity > 1) {
      updateQuantity({
        cartId: cart.id,
        product,
        quantity: totalQuantity
      });
      toast.success(`Se han agregado ${quantity} unidades al carrito.`, {
        richColors: true
      });
    } else {
      addToCart({ product, cartId: cart.id });
    }
  };

  return (
    <Button
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isPending || isUpdatingCart || product.stock === 0}
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
