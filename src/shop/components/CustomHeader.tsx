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
import { useState, useRef, Activity } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import type { ProductSuggestionResponse } from "@/types/product.interface";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

interface SearchDropdownProps {
  isSearchOpen: boolean;
  isLoading: boolean;
  suggestedProducts: ProductSuggestionResponse[];
  selectedIndex: number;
  searchQuery: string;
  isMobile?: boolean;
  handleProductSelect: (slug: string) => void;
  handleSearch: () => void;
  setIsMenuOpen?: (value: boolean) => void;
}

const SearchDropdown = ({
  isSearchOpen,
  isLoading,
  suggestedProducts,
  selectedIndex,
  searchQuery,
  isMobile = false,
  handleProductSelect,
  handleSearch,
  setIsMenuOpen
}: SearchDropdownProps) => {
  if (!isSearchOpen) return null;

  return (
    <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-md shadow-lg z-50 max-h-[415px] overflow-y-auto">
      <div className="p-2">
        {/* Loading State */}
        <Activity mode={isLoading ? "visible" : "hidden"}>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Buscando...
            </span>
          </div>
        </Activity>

        {/* Productos sugeridos */}
        <Activity
          mode={
            !isLoading && suggestedProducts.length > 0 ? "visible" : "hidden"
          }
        >
          <p className="text-xs font-medium text-muted-foreground px-2 py-1">
            Sugerencias
          </p>
          <div className="space-y-1">
            {suggestedProducts.map((product, index) => (
              <button
                key={product.id}
                onClick={() => {
                  handleProductSelect(product.slug);
                  if (isMobile && setIsMenuOpen) setIsMenuOpen(false);
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
        </Activity>

        {/* Opción de búsqueda general */}
        <button
          onClick={() => {
            handleSearch();
            if (isMobile && setIsMenuOpen) setIsMenuOpen(false);
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
      </div>
    </div>
  );
};

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

  const prevFirstProductIdRef = useRef<string | null>(null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data: suggestedProducts = [], isLoading } = useSearchProducts(
    debouncedSearchQuery,
    debouncedSearchQuery.trim().length > 1
  );

  const currentFirstProductId = suggestedProducts[0]?.id ?? null;
  if (prevFirstProductIdRef.current !== currentFirstProductId) {
    prevFirstProductIdRef.current = currentFirstProductId;
    if (selectedIndex !== 0) {
      setSelectedIndex(0);
    }
  }

  const isActive = (path: string) => location.pathname === path;
  const isSearchOpen = searchQuery.trim().length > 1;

  const queryClient = useQueryClient();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    queryClient.clear();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <CustomLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Todos los productos */}
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products") ? "text-primary" : "text-foreground"
              }`}
            >
              Productos
            </Link>
            {/* Hombres */}
            <Link
              to="/products/men"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products/men") ? "text-primary" : "text-foreground"
              }`}
            >
              Hombres
            </Link>
            {/* Mujeres */}
            <Link
              to="/products/women"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/products/women") ? "text-primary" : "text-foreground"
              }`}
            >
              Mujeres
            </Link>
            {/* Niños */}
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
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-secondary/50 border-0"
              />
            </div>
            <SearchDropdown
              isSearchOpen={isSearchOpen}
              isLoading={isLoading}
              suggestedProducts={suggestedProducts}
              selectedIndex={selectedIndex}
              searchQuery={searchQuery}
              handleProductSelect={handleProductSelect}
              handleSearch={handleSearch}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Admin button */}

            <Activity mode={isAdminAccess ? "visible" : "hidden"}>
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
            </Activity>

            {/* Favorites button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
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

            {/* User Account Dropdown */}
            <Activity
              mode={authStatus === "authenticated" ? "visible" : "hidden"}
            >
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
            </Activity>

            {/* Login button */}
            <Activity
              mode={authStatus === "not-authenticated" ? "visible" : "hidden"}
            >
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
            </Activity>

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
        <Activity mode={isMenuOpen ? "visible" : "hidden"}>
          <div className="md:hidden pb-4 space-y-3 animate-fade-in">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={mobileSearchRef}
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-secondary/50 border-0"
              />
              <SearchDropdown
                isSearchOpen={isSearchOpen}
                isLoading={isLoading}
                suggestedProducts={suggestedProducts}
                selectedIndex={selectedIndex}
                searchQuery={searchQuery}
                isMobile
                handleProductSelect={handleProductSelect}
                handleSearch={handleSearch}
                setIsMenuOpen={setIsMenuOpen}
              />
            </div>

            {/* Mobile Navigation Links */}

            {/* Todos los productos */}
            <Link
              to="/products"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>

            {/* Hombres */}
            <Link
              to="/products/men"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Hombres
            </Link>

            {/* Mujeres */}
            <Link
              to="/products/women"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Mujeres
            </Link>

            {/* Niños */}
            <Link
              to="/products/kids"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Niños
            </Link>

            {/* Mobile Admin Link */}
            <Activity mode={isAdminAccess ? "visible" : "hidden"}>
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
