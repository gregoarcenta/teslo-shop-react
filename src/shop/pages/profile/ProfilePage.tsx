import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

import {
  User,
  Package,
  Lock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Activity, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getOrdersAction } from "@/shop/actions/get-orders.action";

const statusColors: Record<string, string> = {
  delivered: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-secondary text-secondary-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20"
};

const statusLabels: Record<string, string> = {
  delivered: "Completado",
  pending: "Pendiente",
  cancelled: "Cancelado"
};

export const ProfilePage = () => {
  const [openOrders, setOpenOrders] = useState<string[]>([]);

  const user = useAuthStore((state) => state.user);

  const { data, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: getOrdersAction,
    enabled: !!user?.id
  });

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const orders = data?.orders;
  // const ordersCount = data?.totalOrders || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-montserrat">Mi Perfil</h1>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Pedidos</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading Skeletons */}
              <Activity mode={isLoadingOrders ? "visible" : "hidden"}>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="space-y-2 text-right">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Activity>
              {/* Orders List */}
              <Activity mode={!isLoadingOrders ? "visible" : "hidden"}>
                {orders?.map((order) => (
                  <Collapsible
                    key={order.id}
                    open={openOrders.includes(order.id)}
                    onOpenChange={() => toggleOrder(order.id)}
                  >
                    <Card className="border-border">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors cursor-pointer">
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">
                                #{order.id.slice(0, 8)}
                              </p>
                              {order.status === "delivered" ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              ) : order.status === "cancelled" ? (
                                <XCircle className="h-4 w-4 text-destructive" />
                              ) : (
                                <Clock className="h-4 w-4 text-warning" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                }
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.totalItems}{" "}
                              {order.totalItems === 1
                                ? "artículo"
                                : "artículos"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right space-y-2">
                              <Badge className={statusColors[order.status]}>
                                {statusLabels[order.status] || order.status}
                              </Badge>
                              <p className="text-lg font-bold text-primary">
                                ${parseFloat(order.totalAmount).toFixed(2)}
                              </p>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                openOrders.includes(order.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <Separator />
                        <div className="p-4 space-y-4">
                          {/* Order Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Estado de Pago
                              </p>
                              <p className="font-medium">
                                {order.paid ? "Pagado" : "Pendiente de Pago"}
                              </p>
                            </div>
                            {order.paid && (
                              <div>
                                <p className="text-muted-foreground">
                                  Pagado el
                                </p>
                                <p className="font-medium">
                                  {new Date(order.paidAt).toLocaleDateString(
                                    "es-ES",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                    }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          <Separator />

                          {/* Products */}
                          <div>
                            <h4 className="font-semibold mb-3">Productos</h4>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-start"
                                >
                                  <div className="flex-1">
                                    <div>
                                      <img
                                        src={`${IMAGE_BASE_URL}${item.product.images[0].name}`}
                                        alt={item.product.title}
                                        className="h-12 w-12 rounded-lg inline ml-2 align-middle object-cover"
                                        crossOrigin="anonymous"
                                      />
                                      <p className="font-medium text-sm inline ml-2 align-middle">
                                        {item.product.title}
                                      </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-3 mt-1">
                                      Cantidad: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-medium text-sm">
                                    $
                                    {(
                                      parseFloat(item.price) * item.quantity
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Total */}
                          <div className="flex justify-between items-center pt-2">
                            <p className="font-semibold">Total</p>
                            <p className="text-xl font-bold text-primary">
                              ${parseFloat(order.totalAmount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </Activity>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder={user?.fullName} />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Pérez" />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder={user?.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="" />
                </div>
                <Button className="gradient-hero">Guardar Cambios</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="gradient-hero">Actualizar Contraseña</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
