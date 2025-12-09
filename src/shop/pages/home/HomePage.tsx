import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import heroProduct1 from "@/assets/hero-product-1.jpg";
import heroProduct2 from "@/assets/hero-product-2.jpg";

export const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [heroProduct1, heroProduct2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen mb-20">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] overflow-hidden bg-secondary/20">
        {/* Background Images with Fade Effect */}
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentImage === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg font-montserrat">
              Descubre tu{" "}
              <span className="bg-linear-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Estilo Único
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              Explora nuestra colección exclusiva de moda para hombres, mujeres
              y niños. Calidad premium, diseños modernos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gradient-hero shadow-glow" asChild>
                <Link to="/products">
                  Explorar Productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/products/men">Colección Hombres</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all ${
                currentImage === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
          Compra por Categoría
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Hombres",
              type: "men",
              gradient: "from-primary to-primary-glow"
            },
            {
              title: "Mujeres",
              type: "women",
              gradient: "from-accent to-orange-400"
            },
            {
              title: "Niños",
              type: "kids",
              gradient: "from-primary-glow to-accent"
            }
          ].map((category, index) => (
            <Link
              key={category.type}
              to={`/products/${category.type}`}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-medium hover:shadow-glow transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${category.gradient} opacity-80 group-hover:opacity-90 transition-opacity`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div
              className="space-y-3 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-16 h-16 mx-auto gradient-hero rounded-full flex items-center justify-center shadow-glow">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold">Envío Gratis</h3>
              <p className="text-muted-foreground">En pedidos mayores a $50</p>
            </div>
            <div
              className="space-y-3 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 mx-auto gradient-accent rounded-full flex items-center justify-center shadow-glow">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold">Pago Seguro</h3>
              <p className="text-muted-foreground">100% protección de compra</p>
            </div>
            <div
              className="space-y-3 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-16 h-16 mx-auto gradient-hero rounded-full flex items-center justify-center shadow-glow">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-semibold">Devoluciones Fáciles</h3>
              <p className="text-muted-foreground">30 días para cambios</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
