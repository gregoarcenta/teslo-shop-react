import type { User } from "@/types/user.interface";
import { create } from "zustand";

type AuthSatus = "checking" | "authenticated" | "not-authenticated";

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  authStatus: AuthSatus;
  login: (userData: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: false,
  user: null,
  authStatus: "checking",
  login: (userData: User) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null })
}));
