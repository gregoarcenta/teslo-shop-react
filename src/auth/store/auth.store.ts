import type { User } from "@/types/user.interface";
import { create } from "zustand";
import { checkStatusAction } from "../actions/check-auth.action";
import { loginAction, type LoginCredentials } from "../actions/login.action";

type AuthSatus = "checking" | "authenticated" | "not-authenticated";

type AuthState = {
  // State
  isLoggedIn: boolean;
  user: User | null;
  authStatus: AuthSatus;
  // Getters

  // Actions
  login: (loginData: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<{ user: User | null }>;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: false,
  user: null,
  authStatus: "checking",
  login: async (loginData) => {
    try {
      const { user, accessToken } = await loginAction(loginData);
      localStorage.setItem("teslo-access-token", accessToken);
      set({ isLoggedIn: true, user: user, authStatus: "authenticated" });
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ isLoggedIn: false, user: null, authStatus: "not-authenticated" });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("teslo-access-token");
    set({ isLoggedIn: false, user: null, authStatus: "not-authenticated" });
  },
  checkAuthStatus: async () => {
    const token = localStorage.getItem("teslo-access-token");

    if (!token) {
      set({ isLoggedIn: false, user: null, authStatus: "not-authenticated" });
      return { user: null };
    }

    try {
      const { user, accessToken } = await checkStatusAction();
      localStorage.setItem("teslo-access-token", accessToken);
      set({ isLoggedIn: true, user: user, authStatus: "authenticated" });
      return { user };
    } catch (error) {
      localStorage.removeItem("teslo-access-token");
      set({ isLoggedIn: false, user: null, authStatus: "not-authenticated" });
      throw error;
    }
  }
}));
