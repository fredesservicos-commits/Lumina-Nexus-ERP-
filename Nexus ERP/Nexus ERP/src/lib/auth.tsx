import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export interface AuthUser {
  email: string;
  localId: string;
  idToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("nexus_erp_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiCall(url: string, body: object) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Erro na requisição");
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser());

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await apiCall(`${API}/auth/login`, { email, password });
    localStorage.setItem("nexus_erp_auth", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await apiCall(`${API}/auth/register`, { email, password });
    localStorage.setItem("nexus_erp_auth", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("nexus_erp_auth");
    setUser(null);
    window.location.href = "/";
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
