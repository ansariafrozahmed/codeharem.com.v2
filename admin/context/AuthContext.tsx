"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  adminLogin,
  adminLogout,
  adminGetMe,
  setToken,
  getToken,
} from "@/lib/api";

interface Admin {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      // Try to restore from sessionStorage
      const stored = sessionStorage.getItem("admin_token");
      if (stored) {
        setToken(stored);
      } else {
        setLoading(false);
        return;
      }
    }

    try {
      const data = await adminGetMe();
      setAdmin(data);
    } catch {
      setToken(null);
      sessionStorage.removeItem("admin_token");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const data = await adminLogin(email, password);
    sessionStorage.setItem("admin_token", data.accessToken);
    const me = await adminGetMe();
    setAdmin(me);
  };

  const logout = async () => {
    await adminLogout();
    sessionStorage.removeItem("admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
