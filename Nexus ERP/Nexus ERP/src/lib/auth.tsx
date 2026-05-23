import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import {
  auth,
  login as fbLogin,
  register as fbRegister,
  logout as fbLogout,
  onAuthChange,
} from "@/lib/firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export interface AuthUser {
  email: string;
  localId: string;
  idToken: string;
  refreshToken: string;
  displayName?: string | null;
  role?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
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
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem("nexus_erp_auth", JSON.stringify(user));
  } else {
    localStorage.removeItem("nexus_erp_auth");
  }
}

function buildAuthUser(fbUser: import("firebase/auth").User, role?: string): Promise<AuthUser> {
  return fbUser.getIdToken().then((token) => ({
    email: fbUser.email || "",
    localId: fbUser.uid,
    idToken: token,
    refreshToken: fbUser.refreshToken || "",
    displayName: fbUser.displayName,
    role: role || null,
  }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((fbUser) => {
      if (fbUser) {
        buildAuthUser(fbUser, loadUser()?.role || undefined).then((authUser) => {
          persistUser(authUser);
          setUser(authUser);
        }).catch(() => {
          persistUser(null);
          setUser(null);
        });
      } else {
        persistUser(null);
        setUser(null);
      }
      setReady(true);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const credential = await fbLogin(email, password);
    const fbUser = credential.user;
    let role = "operador";
    try {
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      if (snap.exists()) role = snap.data().role || "operador";
    } catch {}
    const authUser = await buildAuthUser(fbUser, role);
    persistUser(authUser);
    setUser(authUser);
    return authUser;
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName?: string): Promise<AuthUser> => {
      const credential = await fbRegister(email, password);
      const fbUser = credential.user;
      const display = displayName || fbUser.email?.split("@")[0] || "";
      await setDoc(doc(db, "users", fbUser.uid), {
        email: fbUser.email,
        displayName: display,
        role: "operador",
        createdAt: new Date().toISOString(),
      }).catch(() => {});
      const authUser = await buildAuthUser(fbUser, "operador");
      persistUser(authUser);
      setUser(authUser);
      return authUser;
    },
    [],
  );

  const logout = useCallback(() => {
    fbLogout();
    persistUser(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const isAdmin = user?.role === "admin";
  const isGerente = user?.role === "gerente" || user?.role === "admin";

  const value = useMemo(
    () => ({ user, login, register, logout, isAdmin, isGerente }),
    [user, login, register, logout, isAdmin, isGerente],
  );

  if (!ready) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
