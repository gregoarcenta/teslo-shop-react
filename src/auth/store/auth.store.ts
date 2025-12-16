import type { User } from "@/types/user.interface";
import { create } from "zustand";
import { checkStatusAction } from "../actions/check-auth.action";
import { loginAction, type LoginCredentials } from "../actions/login.action";
import {
  registerAction,
  type RegisterCredentials
} from "../actions/register.action";

type AuthSatus = "checking" | "authenticated" | "not-authenticated";

type AuthState = {
  // State
  user: User | null;
  authStatus: AuthSatus;
  cartId: string | null;
  // Getters
  isAdminAccess: () => boolean;
  // Actions
  login: (loginData: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<{ user: User | null }>;
  register: (registerData: RegisterCredentials) => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  authStatus: "checking",
  cartId: null,
  isAdminAccess: () => {
    const userRoles = get().user?.roles || [];
    return userRoles.includes("admin") || userRoles.includes("tester");
  },
  login: async (loginData) => {
    try {
      const { user, accessToken, cartId } = await loginAction(loginData);
      localStorage.setItem("teslo-access-token", accessToken);
      set({ user, authStatus: "authenticated", cartId });
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ user: null, authStatus: "not-authenticated", cartId: null });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("teslo-access-token");
    set({ user: null, authStatus: "not-authenticated", cartId: null });
  },
  checkAuthStatus: async () => {
    try {
      const { user, accessToken, cartId } = await checkStatusAction();
      localStorage.setItem("teslo-access-token", accessToken);
      set({ user: user, authStatus: "authenticated", cartId });
      return { user };
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ user: null, authStatus: "not-authenticated", cartId: null });
      throw error;
    }
  },
  register: async (registerData) => {
    try {
      const { user, accessToken, cartId } = await registerAction(registerData);
      localStorage.setItem("teslo-access-token", accessToken);
      set({ user: user, authStatus: "authenticated", cartId });
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ user: null, authStatus: "not-authenticated", cartId: null });
      throw error;
    }
  }
}));
