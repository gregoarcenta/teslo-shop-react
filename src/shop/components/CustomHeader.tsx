import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  LogOut,
  LogIn,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useRef, Activity } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import tshirtWhite from "@/assets/tesla-tshirt-white.jpg";
import jacketBlack from "@/assets/tesla-jacket-black.jpg";
import hoodieGray from "@/assets/tesla-hoodie-gray.jpg";
import capBlack from "@/assets/tesla-cap-black.jpg";
import sweatshirtNavy from "@/assets/tesla-sweatshirt-navy.jpg";
import longsleeveCharcoal from "@/assets/tesla-longsleeve-charcoal.jpg";
import { Link, useLocation, useNavigate } from "react-router";
import CustomLogo from "@/components/custom/CustomLogo";

// Mock data - same as in Products page
const mockProducts = [
  {
    id: "1",
    name: "Camiseta Tesla Wordmark",
    description: "Camiseta blanca con el icónico logo de Tesla",
    price: 35.0,
    type: "men",
    tags: ["casual", "camiseta", "tesla"],
    imageUrl: tshirtWhite
  },
  {
    id: "2",
    name: "Chaqueta Tesla Premium",
    description: "Chaqueta negra con capucha y logo Tesla",
    price: 150.0,
    type: "men",
    tags: ["abrigo", "premium", "tesla"],
    imageUrl: jacketBlack
  },
  {
    id: "3",
    name: "Sudadera Tesla Gris",
    description: "Sudadera con capucha color gris con logo Tesla",
    price: 65.0,
    type: "men",
    tags: ["sudadera", "casual", "tesla"],
    imageUrl: hoodieGray
  },
  {
    id: "4",
    name: "Gorra Tesla Icon",
    description: "Gorra negra con logo Tesla bordado",
    price: 30.0,
    type: "men",
    tags: ["gorra", "accesorio", "tesla"],
    imageUrl: capBlack
  },
  {
    id: "5",
    name: "Sudadera Tesla Navy",
    description: "Sudadera azul marino con logo Tesla",
    price: 60.0,
    type: "women",
    tags: ["sudadera", "casual", "tesla"],
    imageUrl: sweatshirtNavy
  },
  {
    id: "6",
    name: "Camiseta Manga Larga Tesla",
    description: "Camiseta de manga larga color carbón con logo Tesla",
    price: 45.0,
    type: "men",
    tags: ["camiseta", "manga larga", "tesla"],
    imageUrl: longsleeveCharcoal
  }
];

export const CustomHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [user, setUser] = useState<null>(null);

  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  //   const { canAccessAdmin } = useUserRole(user);
  const canAccessAdmin = true;

  const isActive = (path: string) => location.pathname === path;
  const isSearchOpen = searchQuery.trim().length > 0;

  // Productos sugeridos para autocompletado (máximo 5)
  const suggestedProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const filtered = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    return filtered.slice(0, 5);
  }, [searchQuery]);

  // Reset selected index when products change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestedProducts]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(
        `${location.pathname}?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
      // Quitar foco del input
      desktopSearchRef.current?.blur();
      mobileSearchRef.current?.blur();
      setIsMenuOpen(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    // Quitar foco del input
    desktopSearchRef.current?.blur();
    mobileSearchRef.current?.blur();
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Total de items = productos sugeridos + 1 opción de búsqueda general
    const totalItems = suggestedProducts.length + 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        // Si está en el último índice (opción de búsqueda general) o no hay productos
        if (selectedIndex === suggestedProducts.length) {
          handleSearch();
        } else if (suggestedProducts[selectedIndex]) {
          handleProductSelect(suggestedProducts[selectedIndex].id);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchQuery("");
        break;
    }
  };

  const handleLogout = async () => {
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}

          <CustomLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products") ? "text-primary" : "text-foreground"
              }`}
            >
              Productos
            </Link>
            <Link
              to="/products/men"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products/men") ? "text-primary" : "text-foreground"
              }`}
            >
              Hombres
            </Link>
            <Link
              to="/products/women"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products/women") ? "text-primary" : "text-foreground"
              }`}
            >
              Mujeres
            </Link>
            <Link
              to="/products/kids"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products/kids") ? "text-primary" : "text-foreground"
              }`}
            >
              Niños
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center max-w-md flex-1 mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={desktopSearchRef}
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-secondary/50 border-0"
              />
            </div>
            <Activity mode={isSearchOpen ? "visible" : "hidden"}>
              <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-md shadow-lg z-50">
                <div className="p-2">
                  {suggestedProducts.length > 0 && (
                    <>
                      <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                        Sugerencias
                      </p>
                      <div className="space-y-1">
                        {suggestedProducts.map((product, index) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left ${
                              index === selectedIndex
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium text-sm truncate ${
                                  index === selectedIndex
                                    ? "text-primary-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {product.name}
                              </p>
                              <p
                                className={`text-sm truncate ${
                                  index === selectedIndex
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-border my-2"></div>
                    </>
                  )}
                  <button
                    onClick={handleSearch}
                    className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left ${
                      selectedIndex === suggestedProducts.length
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded flex items-center justify-center ${
                        selectedIndex === suggestedProducts.length
                          ? "bg-primary-foreground/20"
                          : "bg-muted"
                      }`}
                    >
                      <Search
                        className={`h-5 w-5 ${
                          selectedIndex === suggestedProducts.length
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm ${
                          selectedIndex === suggestedProducts.length
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        Ver todos los resultados para "{searchQuery}"
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </Activity>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {canAccessAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-1.5 rounded-md ${
                  isActive("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden md:flex"
                >
                  <Link to="/favorites">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favoritos</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/cart">
                    <ShoppingBag className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Carrito de Compras</p>
              </TooltipContent>
            </Tooltip>

            {user ? (
              <Tooltip>
                <DropdownMenu>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipContent>
                  <p>Mi Cuenta</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/auth">
                      <LogIn className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Iniciar Sesión</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Menú</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile Menu */}
        <Activity mode={isMenuOpen ? "visible" : "hidden"}>
          <div className="md:hidden pb-4 space-y-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={mobileSearchRef}
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                className="pl-10 bg-secondary/50 border-0"
              />
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-md shadow-lg z-50">
                  <div className="p-2">
                    {suggestedProducts.length > 0 && (
                      <>
                        <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                          Sugerencias
                        </p>
                        <div className="space-y-1">
                          {suggestedProducts.map((product, index) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                handleProductSelect(product.id);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left ${
                                index === selectedIndex
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium text-sm truncate ${
                                    index === selectedIndex
                                      ? "text-primary-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {product.name}
                                </p>
                                <p
                                  className={`text-sm truncate ${
                                    index === selectedIndex
                                      ? "text-primary-foreground/80"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-border my-2"></div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleSearch();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left ${
                        selectedIndex === suggestedProducts.length
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded flex items-center justify-center ${
                          selectedIndex === suggestedProducts.length
                            ? "bg-primary-foreground/20"
                            : "bg-muted"
                        }`}
                      >
                        <Search
                          className={`h-5 w-5 ${
                            selectedIndex === suggestedProducts.length
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${
                            selectedIndex === suggestedProducts.length
                              ? "text-primary-foreground"
                              : "text-foreground"
                          }`}
                        >
                          Ver todos los resultados para "{searchQuery}"
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/products"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/products/men"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Hombres
            </Link>
            <Link
              to="/products/women"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Mujeres
            </Link>
            <Link
              to="/products/kids"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Niños
            </Link>

            <Activity mode={canAccessAdmin ? "hidden" : "visible"}>
              <Link
                to="/admin"
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md mt-2 ${
                  isActive("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Panel de Admin
              </Link>
            </Activity>
          </div>
        </Activity>
      </div>
    </nav>
  );
};
