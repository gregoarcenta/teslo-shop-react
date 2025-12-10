import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  LogOut,
  LogIn,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
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
import { Link, useLocation, useNavigate } from "react-router";
import CustomLogo from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDebounce } from "use-debounce";
import { useSearchProducts } from "../hooks/useSearchProducts";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const CustomHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const authStatus = useAuthStore((state) => state.authStatus);
  const isAdminAccess = useAuthStore((state) => state.isAdminAccess());
  const logout = useAuthStore((state) => state.logout);

  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  // Debounce con librería use-debounce
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Query con TanStack Query
  const { data: suggestedProducts = [], isLoading } = useSearchProducts(
    debouncedSearchQuery,
    debouncedSearchQuery.trim().length > 2
  );

  const isActive = (path: string) => location.pathname === path;
  const isSearchOpen = searchQuery.trim().length > 1;

  // Reset selected index when products change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestedProducts]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const currentPath = location.pathname;
    const trimmedQuery = searchQuery.trim();

    // Si está en una ruta de productos, mantener la ruta
    if (currentPath.startsWith("/products")) {
      navigate(`${currentPath}?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // Si está en otra ruta, ir a /products con búsqueda
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }

    // Limpiar y quitar foco
    setSearchQuery("");
    desktopSearchRef.current?.blur();
    mobileSearchRef.current?.blur();
    setIsMenuOpen(false);
  };

  const handleProductSelect = (productSlug: string) => {
    navigate(`/product/${productSlug}`);
    setSearchQuery("");
    desktopSearchRef.current?.blur();
    mobileSearchRef.current?.blur();
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        if (selectedIndex === suggestedProducts.length) {
          handleSearch();
        } else if (suggestedProducts[selectedIndex]) {
          handleProductSelect(suggestedProducts[selectedIndex].slug);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchQuery("");
        desktopSearchRef.current?.blur();
        mobileSearchRef.current?.blur();
        break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Componente SearchDropdown
  const SearchDropdown = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (!isSearchOpen) return null;

    return (
      <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
        <div className="p-2">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Buscando...
              </span>
            </div>
          )}

          {/* Productos sugeridos */}
          {!isLoading && suggestedProducts.length > 0 && (
            <>
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                Sugerencias
              </p>
              <div className="space-y-1">
                {suggestedProducts.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      handleProductSelect(product.slug);
                      if (isMobile) setIsMenuOpen(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left ${
                      index === selectedIndex
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <img
                      src={IMAGE_BASE_URL + product.image}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm truncate ${
                          index === selectedIndex
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {product.title}
                      </p>
                      <p
                        className={`text-sm truncate ${
                          index === selectedIndex
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        ${product.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-border my-2"></div>
            </>
          )}

          {/* Opción de búsqueda general - Solo si hay query */}
          {searchQuery.trim() && (
            <button
              onClick={() => {
                handleSearch();
                if (isMobile) setIsMenuOpen(false);
              }}
              className={`cursor-pointer w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left ${
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
          )}
        </div>
      </div>
    );
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

          {/* Search Bar Desktop */}
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
            <SearchDropdown />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Admin button */}
            {isAdminAccess && (
              <Link
                to="/admin"
                className={`hidden md:flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-1.5 rounded-md ${
                  isActive("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}

            {/* Favorites button */}
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

            {/* Cart button */}
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

            {/* User account button */}
            {authStatus === "authenticated" ? (
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

            {/* Mobile menu button */}
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
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-fade-in">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={mobileSearchRef}
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-secondary/50 border-0"
              />
              <SearchDropdown isMobile />
            </div>

            {/* Mobile Navigation Links */}
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

            {/* Mobile Admin Link */}
            {isAdminAccess && (
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
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
