import { create } from "zustand";

interface User {
  id: number;
  email?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  setAuth: (user, token) => {
    localStorage.setItem("token", token);

    return set({
      user,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },
}));
