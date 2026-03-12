"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "@/types";
import {
  setAccessToken,
  apiGetMe,
  apiRefreshToken,
  apiLogout,
  apiLogin,
  apiRegister,
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokenAndFetchUser: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await apiGetMe();
      setUser(userData);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  // On mount, try to refresh the token (cookie-based)
  useEffect(() => {
    async function init() {
      try {
        const data = await apiRefreshToken();
        setAccessToken(data.accessToken);
        await fetchUser();
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setAccessToken(data.accessToken);
    await fetchUser();
  };

  const register = async (email: string, password: string, name: string) => {
    const data = await apiRegister(email, password, name);
    setAccessToken(data.accessToken);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const setTokenAndFetchUser = async (token: string) => {
    setAccessToken(token);
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setTokenAndFetchUser, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
