export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Prova {
  id: number;
  codigo: string;
  foto_url: string | null;
  notas: string | null;
  tipo_vinculo: string;
  status: string;
  created_at: string;
}

export interface ResumoDia {
  dia: string;
  timezone: string;
  registradas: number;
  conferidas: number;
  recusadas: number;
  total: number;
}

const TOKEN_KEY = "bagagem_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/auth/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Usuário ou senha inválidos");
  const data = await res.json();
  const token = data.access_token as string;
  sessionStorage.setItem(TOKEN_KEY, token);
  return token;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) throw new Error("Faça login");
  return { Authorization: `Bearer ${token}` };
}

/** Leitura aberta — sem token e sem auto-login. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
  return res.json();
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PATCH",
  body: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 401) logout();
    throw new Error(await res.text());
  }
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) logout();
    throw new Error(await res.text());
  }
}
