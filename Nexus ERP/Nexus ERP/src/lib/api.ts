const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function getToken(): Promise<string | null> {
  try {
    const { auth } = await import("@/lib/firebase/auth");
    const fbUser = auth.currentUser;
    if (fbUser) return await fbUser.getIdToken();
  } catch {}
  try {
    const raw = localStorage.getItem("nexus_erp_auth");
    if (!raw) return null;
    return JSON.parse(raw).idToken || null;
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
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
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
