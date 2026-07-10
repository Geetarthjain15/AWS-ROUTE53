import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accountName: string;
  email: string;
  login: (token: string, accountName: string, email: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accountName: "",
  email: "",
  login: (token, accountName, email) => {
    const expiresAt = new Date().getTime() + 10 * 60 * 1000; // 10 minutes from now
    localStorage.setItem("token", token);
    localStorage.setItem("accountName", accountName);
    localStorage.setItem("email", email);
    localStorage.setItem("expiresAt", expiresAt.toString());
    set({ isAuthenticated: true, accountName, email });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountName");
    localStorage.removeItem("email");
    localStorage.removeItem("expiresAt");
    set({ isAuthenticated: false, accountName: "", email: "" });
  },
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const accountName = localStorage.getItem("accountName") || "";
    const email = localStorage.getItem("email") || "";
    const expiresAtStr = localStorage.getItem("expiresAt");
    
    // Check if session has expired (10 minutes)
    if (expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr, 10);
      if (new Date().getTime() > expiresAt) {
        // Session expired, clear storage and log out
        localStorage.removeItem("token");
        localStorage.removeItem("accountName");
        localStorage.removeItem("email");
        localStorage.removeItem("expiresAt");
        set({ isAuthenticated: false, accountName: "", email: "" });
        return;
      }
    }
    
    set({ isAuthenticated: !!token, accountName, email });
  },
}));
