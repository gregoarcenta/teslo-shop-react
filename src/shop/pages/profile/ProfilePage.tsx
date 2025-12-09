import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  User,
  Package,
  Lock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

// Tipo de datos que coincide con la respuesta del backend
type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    title: string;
  };
};

type Order = {
  id: string;
  totalAmount: string;
  totalItems: number;
  status: string;
  paid: boolean;
  paidAt: string;
  createdAt: string;
  items: OrderItem[];
};

const mockOrders: Order[] = [
  {
    id: "9b12083a-5fe9-403b-80f9-6906adee303e",
    totalAmount: "10.00",
    totalItems: 1,
    status: "pending",
    paid: false,
    paidAt: "2024-11-08T22:51:11.862Z",
    createdAt: "2024-11-08T22:51:11.862Z",
    items: [
      {
        id: "9b12083a-5fe9-403b-80f9-6906adee303e",
        quantity: 2,
        price: "10.99",
        product: {
          id: "a147db81-1eab-462e-9dd9-c086131c191f",
          title: "Camiseta Teslo"
        }
      }
    ]
  },
  {
    id: "8c23194b-6gfa-514c-91ga-7017beef403f",
    totalAmount: "89.99",
    totalItems: 2,
    status: "delivered",
    paid: true,
    paidAt: "2024-11-10T14:30:00.000Z",
    createdAt: "2024-11-10T14:25:00.000Z",
    items: [
      {
        id: "item-001",
        quantity: 1,
        price: "45.99",
        product: {
          id: "prod-001",
          title: "Sudadera Tesla Gris"
        }
      },
      {
        id: "item-002",
        quantity: 1,
        price: "44.00",
        product: {
          id: "prod-002",
          title: "Gorra Tesla Negra"
        }
      }
    ]
  },
  {
    id: "7d34205c-5hgb-625d-02hb-8128cffg514g",
    totalAmount: "67.50",
    totalItems: 1,
    status: "cancelled",
    paid: false,
    paidAt: "2024-11-12T10:15:00.000Z",
    createdAt: "2024-11-12T09:45:00.000Z",
    items: [
      {
        id: "item-003",
        quantity: 1,
        price: "67.50",
        product: {
          id: "prod-003",
          title: "Chaqueta Tesla Negra"
        }
      }
    ]
  }
];

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
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    // Simular carga de órdenes
    const timer = setTimeout(() => {
      setIsLoadingOrders(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

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
              {isLoadingOrders ? (
                // Loading Skeleton
                <>
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
                </>
              ) : (
                // Orders List
                mockOrders.map((order) => (
                  <Collapsible
                    key={order.id}
                    open={openOrders.includes(order.id)}
                    onOpenChange={() => toggleOrder(order.id)}
                  >
                    <Card className="border-border">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
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
                                    <p className="font-medium text-sm">
                                      {item.product.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
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
                ))
              )}
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
                    <Input id="firstName" placeholder="Juan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Pérez" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="juan@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="+34 600 000 000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Calle Principal 123, Ciudad"
                  />
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
