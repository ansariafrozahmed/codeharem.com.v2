const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

let accessToken: string | null = null;

export function setToken(token: string | null) {
  accessToken = token;
}

export function getToken(): string | null {
  return accessToken;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return res;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  const res = await apiFetch("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Login failed");
  }

  const data = await res.json();
  setToken(data.accessToken);
  return data;
}

export async function adminLogout(): Promise<void> {
  await apiFetch("/admin/auth/logout", { method: "POST" });
  setToken(null);
}

export async function adminGetMe() {
  const res = await apiFetch("/admin/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function adminList() {
  const res = await apiFetch("/admin/admins");
  if (!res.ok) throw new Error("Failed to fetch admins");
  return res.json();
}
