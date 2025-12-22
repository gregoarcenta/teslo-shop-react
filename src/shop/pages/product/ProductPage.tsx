import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, Shield, RefreshCw, ChevronLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import { AddToCartButton } from "@/shop/components/CustomBtnAddProduct";
import { FavoriteButton } from "@/shop/components/CustomFavoriteButtom";
import { useProduct } from "@/shop/hooks/useProduct";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const ProductPage = () => {
  const { idSlug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  // const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProduct({ idSlug: idSlug! });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-16" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/products" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30 shadow-medium">
            <img
              src={IMAGE_BASE_URL + product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary shadow-glow"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <img
                  src={IMAGE_BASE_URL + image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-primary text-primary">
                {product.gender === "men"
                  ? "Hombre"
                  : product.gender === "women"
                  ? "Mujer"
                  : product.gender === "kid"
                  ? "Niño"
                  : "Unisex"}
              </Badge>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-3xl font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ${product.price}
            </p>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">
              Selecciona tu talla:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={selectedSize === size ? "gradient-hero" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            {/* <label className="text-sm font-semibold">Cantidad:</label> */}
            <div className="flex items-center gap-3">
              {/* <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-lg font-semibold w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
              >
                +
              </Button> */}
              <span className="text-sm text-muted-foreground ml-2">
                ({product.stock} disponibles)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {/* Add to Cart button */}
            <AddToCartButton
              product={product}
              size="lg"
              className="flex-1 gradient-hero shadow-glow"
            >
              Agregar al Carrito
            </AddToCartButton>
            {/* Favorite button */}
            <FavoriteButton
              product={product}
              variant="page"
              size="lg"
              className="bg-primary/5
              "
            />
          </div>

          {/* Features */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Envío gratis en pedidos superiores a $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span>Devoluciones fáciles en 30 días</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Garantía de calidad y autenticidad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
