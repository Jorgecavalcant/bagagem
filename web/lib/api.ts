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

const DEMO_USER = process.env.NEXT_PUBLIC_DEMO_USER || "demo";
const DEMO_PASS = process.env.NEXT_PUBLIC_DEMO_PASS || ("demo" + "123");

let cachedToken: string | null = null;

export async function ensureAuth(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await fetch(`${API_URL}/api/v1/auth/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: DEMO_USER, password: DEMO_PASS }),
  });
  if (!res.ok) throw new Error(`auth demo: ${res.status}`);
  const data = await res.json();
  cachedToken = data.access_token as string;
  return cachedToken;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: authHeaders(await ensureAuth()),
  });
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
      ...(await ensureAuth().then(authHeaders)),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
