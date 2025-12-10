import { useAuthStore } from "@/auth/store/auth.store";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") return <Navigate to="/auth" />;

  return <>{children}</>;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === "checking") return null;

  if (authStatus === "authenticated") return <Navigate to="/" />;

  return <>{children}</>;
};

export const AdminAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const isAdminAccess = useAuthStore((state) => state.isAdminAccess);

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") return <Navigate to="/auth" />;

  if (!isAdminAccess()) return <Navigate to="/" />;

  return <>{children}</>;
};
