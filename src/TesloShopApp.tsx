import { RouterProvider } from "react-router";
import { appRouter } from "./app.router";
import { Toaster } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "./auth/store/auth.store";

const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const logout = useAuthStore((state) => state.logout);
  const authStatus = useAuthStore((state) => state.authStatus);

  const token = localStorage.getItem("teslo-access-token");

  if (!token) logout();

  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthStatus,
    retry: false,
    enabled: !!token && authStatus === "checking",
    refetchInterval: 1000 * 60 * 1.5 // 1.5 minutes
  });

  if (isLoading) return <LoadingSpinner />;

  return <>{children}</>;
};

export const TesloShopApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <CheckAuthProvider>
        <RouterProvider router={appRouter} />
      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Verificando sesión...</p>
    </div>
  </div>
);
