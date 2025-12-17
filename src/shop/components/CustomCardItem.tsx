import { Activity, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { CartItem } from "@/types/cart.interface";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import type { DeleteFromCartPayload } from "../actions/delete-from-cart.action";
import type { UpdateCartPayload } from "../actions/update-cart.action";

interface Props {
  cartItem: CartItem;
  onDelete: (params: DeleteFromCartPayload) => void;
  onUpdate: (params: UpdateCartPayload) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const CustomCardItem = ({
  cartItem,
  onDelete,
  onUpdate,
  isDeleting,
  isUpdating
}: Props) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [debouncedQuantity] = useDebounce(quantity, 300);

  const { data: cart } = useCart();

  const cartId = cart?.id || "";
  const itemId = cartItem.id;
  const product = cartItem.product;

  const handleUpdateQuantity = (newQuantity: number) => {
    if (
      newQuantity === 0 ||
      newQuantity > product.stock ||
      newQuantity === quantity
    )
      return;

    setQuantity(Math.max(1, Math.min(product.stock, newQuantity)));
  };

  useEffect(() => {
    // Validar que la cantidad haya cambiado antes de hacer la petición
    if (debouncedQuantity === cartItem.quantity) return;

    onUpdate({ cartId, product, quantity: debouncedQuantity });
  }, [debouncedQuantity]);

  return (
    <Card key={itemId} className={`p-4`}>
      <div className="flex gap-4">
        <img
          src={IMAGE_BASE_URL + product.images[0]}
          alt={product.title}
          crossOrigin="anonymous"
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {product.gender === "men"
              ? "Hombre"
              : product.gender === "women"
              ? "Mujer"
              : product.gender === "kid"
              ? "Niño/a"
              : "Unisex"}
          </p>
          <Activity
            mode={product.stock < 5 && product.stock > 0 ? "visible" : "hidden"}
          >
            <p className="text-xs text-accent mb-2">
              ¡Solo quedan {product.stock} en stock!
            </p>
          </Activity>
          <Activity mode={product.stock === 0 ? "visible" : "hidden"}>
            <p className="text-xs text-destructive mb-2">Agotado</p>
          </Activity>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={quantity <= 1 || isUpdating}
              onClick={() => handleUpdateQuantity(quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={quantity >= product.stock || isUpdating}
              onClick={() => handleUpdateQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-right space-y-2">
          <p className="text-lg font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ${(Number(product.price) * quantity).toFixed(2)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            disabled={isDeleting}
            onClick={() => onDelete({ productId: product.id, cartId })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CustomCardItem;
