import type { User } from "@/types/user.interface";
import { create } from "zustand";
import { checkStatusAction } from "../actions/check-auth.action";
import { loginAction, type LoginCredentials } from "../actions/login.action";

type AuthSatus = "checking" | "authenticated" | "not-authenticated";

type AuthState = {
  // State
  user: User | null;
  authStatus: AuthSatus;
  // Getters
  isAdminAccess: () => boolean;
  // Actions
  login: (loginData: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<{ user: User | null }>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  authStatus: "checking",
  isAdminAccess: () => {
    const userRoles = get().user?.roles || [];
    return userRoles.includes("admin") || userRoles.includes("tester");
  },
  login: async (loginData) => {
    try {
      const { user, accessToken } = await loginAction(loginData);
      localStorage.setItem("teslo-access-token", accessToken);
      set({ user: user, authStatus: "authenticated" });
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ user: null, authStatus: "not-authenticated" });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("teslo-access-token");
    set({ user: null, authStatus: "not-authenticated" });
  },
  checkAuthStatus: async () => {
    const token = localStorage.getItem("teslo-access-token");

    if (!token) {
      set({ user: null, authStatus: "not-authenticated" });
      return { user: null };
    }

    try {
      const { user, accessToken } = await checkStatusAction();
      localStorage.setItem("teslo-access-token", accessToken);
      set({ user: user, authStatus: "authenticated" });
      return { user };
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ user: null, authStatus: "not-authenticated" });
      throw error;
    }
  }
}));
