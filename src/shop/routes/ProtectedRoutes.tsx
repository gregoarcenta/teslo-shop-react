import { useQuery } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { Navigate, useSearchParams } from "react-router";
import { validateTokenSession } from "../actions/validate-token-sesison.action";

export const PaymentSuccessRoute = ({ children }: PropsWithChildren) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { data: isValid, isLoading } = useQuery({
    queryKey: ["validate-payment-token", token],
    queryFn: () => validateTokenSession(token),
    enabled: !!token,
    retry: false,
    staleTime: Infinity
  });

  if (!token) return <Navigate to="/" replace />;

  if (isLoading) return null;

  if (!isValid) return <Navigate to="/" replace />;

  return <>{children}</>;
};
