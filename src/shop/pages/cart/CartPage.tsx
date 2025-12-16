import { EmptyState } from "@/components/custom/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/shop/hooks/useCart";
import { useDeleteFromCart } from "@/shop/hooks/useDeletetoCart";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Activity } from "react";
import { Link } from "react-router";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const CartPage = () => {
  const { isFetching, data: cart, isError } = useCart();

  const {
    mutate: deleteFromCart,
    isPending: isDeletingFromCart,
    variables
  } = useDeleteFromCart();

  if (isFetching) {
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

  const handleDeleteFromCart = (productId: string) => {
    deleteFromCart({ productId, cartId: cart.id });
  };

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
              const isDeleting =
                isDeletingFromCart && variables?.productId === item.product.id;

              return (
                <Card
                  key={item.id}
                  className={`p-4 ${
                    isDeleting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={IMAGE_BASE_URL + item.product.images[0]}
                      alt={item.product.title}
                      crossOrigin="anonymous"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.gender === "men"
                          ? "Hombre"
                          : item.product.gender === "women"
                          ? "Mujer"
                          : item.product.gender === "kid"
                          ? "Niño/a"
                          : "Unisex"}
                      </p>
                      <Activity
                        mode={
                          item.product.stock < 5 && item.product.stock > 0
                            ? "visible"
                            : "hidden"
                        }
                      >
                        <p className="text-xs text-accent mb-2">
                          ¡Solo quedan {item.product.stock} en stock!
                        </p>
                      </Activity>
                      <Activity
                        mode={item.product.stock === 0 ? "visible" : "hidden"}
                      >
                        <p className="text-xs text-destructive mb-2">Agotado</p>
                      </Activity>
                      <div className="flex items-center gap-3 mb-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                        $
                        {(Number(item.product.price) * item.quantity).toFixed(
                          2
                        )}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteFromCart(item.product.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <span className="flex items-center gap-2">
                            Eliminando...
                          </span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
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
                disabled={isDeletingFromCart}
              >
                Proceder al Pago
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
