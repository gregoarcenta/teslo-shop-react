import CustomLogo from "@/components/custom/CustomLogo";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router";

export const CustomFooter = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="mb-4">
              <CustomLogo />
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu destino para moda de calidad y estilo único.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Comprar</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/men"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Hombres
                </Link>
              </li>
              <li>
                <Link
                  to="/products/women"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Mujeres
                </Link>
              </li>
              <li>
                <Link
                  to="/products/kids"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Niños
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Mi Cuenta
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © 2025 Teslo Shop. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Proyecto de portafolio desarrollado por{" "}
            <span className="font-semibold text-primary">Alex Arcentales</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
