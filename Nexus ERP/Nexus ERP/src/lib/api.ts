import { auth } from "@/lib/firebase/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_CACHE: { token: string; expiry: number } = { token: "", expiry: 0 };

async function getIdTokenWithTimeout(timeoutMs = 5000): Promise<string> {
  const fbUser = auth.currentUser;
  if (!fbUser) throw new Error("No user");
  return Promise.race([
    fbUser.getIdToken(),
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("getIdToken timeout")), timeoutMs),
    ),
  ]);
}

async function getToken(): Promise<string | null> {
  if (TOKEN_CACHE.token && Date.now() < TOKEN_CACHE.expiry) {
    return TOKEN_CACHE.token;
  }
  try {
    const token = await getIdTokenWithTimeout();
    TOKEN_CACHE.token = token;
    TOKEN_CACHE.expiry = Date.now() + 300000;
    return token;
  } catch {}
  try {
    const raw = localStorage.getItem("nexus_erp_auth");
    if (!raw) return null;
    const token = JSON.parse(raw).idToken || null;
    if (token) {
      TOKEN_CACHE.token = token;
      TOKEN_CACHE.expiry = Date.now() + 300000;
    }
    return token;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const token = await getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(url, { headers, signal: controller.signal, ...options });
    if (res.status === 204) return undefined as T;
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body.detail || "Erro na requisição");
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
