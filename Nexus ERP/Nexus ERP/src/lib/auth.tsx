import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import {
  getSupabaseSession,
  onSupabaseAuthChange,
  signInWithSupabase,
  signUpWithSupabase,
  signOutFromSupabase,
} from "@/lib/supabase";

export interface AuthUser {
  email: string;
  localId: string;
  idToken?: string;
  refreshToken?: string;
  displayName?: string | null;
  role?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string, displayName?: string) => Promise<AuthUser>;
  logout: () => void;
  isAdmin: boolean;
  isGerente: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("nexus_erp_auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.email || !parsed.localId) {
      localStorage.removeItem("nexus_erp_auth");
      return null;
    }
    return {
      email: parsed.email,
      localId: parsed.localId,
      displayName: parsed.displayName || null,
      role: parsed.role || null,
    };
  } catch {
    localStorage.removeItem("nexus_erp_auth");
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(
      "nexus_erp_auth",
      JSON.stringify({
        email: user.email,
        localId: user.localId,
        displayName: user.displayName || null,
        role: user.role || null,
      }),
    );
  } else {
    localStorage.removeItem("nexus_erp_auth");
  }
}

function buildAuthUser(session: Awaited<ReturnType<typeof getSupabaseSession>>["data"]["session"], role?: string): AuthUser {
  if (!session || !session.user) {
    throw new Error("Session inválida");
  }

  return {
    email: session.user.email || "",
    localId: session.user.id,
    idToken: session.access_token,
    refreshToken: session.refresh_token || "",
    displayName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || null,
    role: role || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted && !ready) setReady(true);
    }, 5000);

    async function restoreSession() {
      const { data, error } = await getSupabaseSession();
      if (!mounted) return;
      clearTimeout(timeout);
      setReady(true);
      if (error || !data.session || !data.session.user) {
        persistUser(null);
        setUser(null);
        return;
      }
      const authUser = buildAuthUser(data.session, loadUser()?.role || undefined);
      persistUser(authUser);
      setUser(authUser);
    }

    restoreSession().catch(() => {
      if (mounted) {
        persistUser(null);
        setUser(null);
        setReady(true);
      }
    });

    const { data: { subscription } } = onSupabaseAuthChange(async (_event, session) => {
      if (!mounted) return;
      setReady(true);
      if (!session || !session.user) {
        persistUser(null);
        setUser(null);
        return;
      }
      const authUser = buildAuthUser(session, loadUser()?.role || undefined);
      persistUser(authUser);
      setUser(authUser);
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const { data, error } = await signInWithSupabase(email, password);
    if (error || !data.session || !data.session.user) {
      const message = error?.message || "Erro ao autenticar";
      toast.error(message);
      throw new Error(message);
    }

    const authUser = buildAuthUser(data.session, loadUser()?.role || undefined);
    persistUser(authUser);
    setUser(authUser);
    return authUser;
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName?: string): Promise<AuthUser> => {
      const { data, error } = await signUpWithSupabase(email, password, displayName);
      if (error) {
        const code = error.message || "";
        let message = "Erro ao cadastrar";
        if (typeof code === "string") {
          if (code.includes("already registered") || code.includes("duplicate")) {
            message = "Este e-mail já está em uso.";
          } else if (code.includes("invalid email")) {
            message = "E-mail inválido.";
          } else if (code.includes("Password should be at least")) {
            message = "A senha não atende os requisitos mínimos.";
          } else if (code.includes("network")) {
            message = "Falha de rede. Verifique sua conexão e tente novamente.";
          } else {
            message = error.message;
          }
        }
        toast.error(message);
        throw new Error(message);
      }
      if (!data.user) {
        const message = "Falha ao finalizar o cadastro. Tente novamente.";
        toast.error(message);
        throw new Error(message);
      }

      if (!data.session) {
        toast.success("Cadastro realizado! Verifique seu e-mail para confirmar a conta se necessário.");
        return {
          email: data.user.email || "",
          localId: data.user.id,
          displayName: displayName || data.user.email?.split("@")[0] || null,
          role: "operador",
        };
      }

      const authUser = buildAuthUser(data.session, "operador");
      persistUser(authUser);
      setUser(authUser);
      return authUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOutFromSupabase();
    persistUser(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const isAdmin = user?.role === "admin";
  const isGerente = user?.role === "gerente" || user?.role === "admin";

  const value = useMemo(
    () => ({ user, isInitialized: ready, login, register, logout, isAdmin, isGerente }),
    [user, ready, login, register, logout, isAdmin, isGerente],
  );

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
