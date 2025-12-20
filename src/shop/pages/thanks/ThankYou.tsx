import { useEffect } from "react";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router";

export const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Limpiar carrito después de compra exitosa
    // Aquí se puede agregar lógica para limpiar el carrito del usuario
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-primary/10 rounded-full p-6">
              <CheckCircle2
                className="h-24 w-24 text-primary"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div
          className="text-center mb-8 space-y-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-xl text-muted-foreground">
            Tu pedido ha sido confirmado exitosamente
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground">
              Número de orden:{" "}
              <span className="font-mono font-semibold text-foreground">
                #{orderId}
              </span>
            </p>
          )}
        </div>

        {/* Order Details Card */}
        <Card
          className="mb-8 shadow-medium animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <Package className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Confirmación de pedido</h3>
                  <p className="text-sm text-muted-foreground">
                    Hemos enviado un correo de confirmación con los detalles de
                    tu pedido y un número de seguimiento.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Próximos pasos</h3>
                  <p className="text-sm text-muted-foreground">
                    Estamos preparando tu pedido para el envío. Te notificaremos
                    cuando esté en camino.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Button asChild size="lg" className="gradient-hero shadow-soft">
            <Link
              to="/profile"
              className="flex items-center justify-center gap-2"
            >
              <Package className="h-5 w-5" />
              Ver mis Pedidos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2"
            >
              Seguir Comprando
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div
          className="mt-12 text-center space-y-2 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda? Contáctanos en{" "}
            <a
              href="mailto:soporte@tesloshop.com"
              className="text-primary hover:underline font-medium"
            >
              soporte@tesloshop.com
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Tiempo estimado de entrega: 3-5 días hábiles
          </p>
        </div>
      </div>
    </div>
  );
};
