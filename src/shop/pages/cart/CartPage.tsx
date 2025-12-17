import { EmptyState } from "@/components/custom/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CustomCardItem from "@/shop/components/CustomCardItem";
import { useCart } from "@/shop/hooks/useCart";
import { useDeleteFromCart } from "@/shop/hooks/useDeleteFromCart";
import { useUpdateCart } from "@/shop/hooks/useUpdateCart";
import { ShoppingBag } from "lucide-react";
import { Activity } from "react";
import { Link } from "react-router";

export const CartPage = () => {
  const { isLoading, data: cart, isError } = useCart();
  const { mutate: deleteFromCart, isPending: isDeletingFromCart } =
    useDeleteFromCart();
  const { mutate: updateQuantity, isPending: isUpdatingCart } = useUpdateCart();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full mt-6" />
              <Skeleton className="h-10 w-full mt-2" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>
        <p className="text-red-600">
          Ocurrió un error al cargar el carrito. Por favor, intenta nuevamente.
        </p>
      </div>
    );
  }

  const cartItems = cart.cartItems;
  const isCartEmpty = cartItems.length === 0;
  const subtotal = Number(cart.total);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-montserrat">
        Carrito de Compras
      </h1>

      {/* Empty Cart */}
      <Activity mode={isCartEmpty ? "visible" : "hidden"}>
        <EmptyState
          icon={ShoppingBag}
          title="Tu carrito está vacío"
          description="Descubre nuestra increíble colección de productos"
          actionLabel="Explorar Productos"
          actionLink="/products"
        />
      </Activity>

      {/* Cart with Items */}
      <Activity mode={!isCartEmpty ? "visible" : "hidden"}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              return (
                <CustomCardItem
                  key={item.id}
                  cartItem={item}
                  onDelete={deleteFromCart}
                  onUpdate={updateQuantity}
                  isDeleting={isDeletingFromCart}
                  isUpdating={isUpdatingCart}
                />
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-primary">
                    ¡Felicidades! Tienes envío gratis
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                className="w-full mt-6 gradient-hero shadow-glow"
                size="lg"
                disabled={
                  cartItems.length === 0 || isDeletingFromCart || isUpdatingCart
                }
              >
                {isDeletingFromCart || isUpdatingCart ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  "Proceder al Pago"
                )}
              </Button>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/products">Continuar Comprando</Link>
              </Button>
            </Card>
          </div>
        </div>
      </Activity>
    </div>
  );
};
