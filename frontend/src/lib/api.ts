const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
    credentials: "include", // send cookies (refresh token)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth API ───

export async function apiRegister(email: string, password: string, name: string) {
  return request<{ accessToken: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function apiLogin(email: string, password: string) {
  return request<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRefreshToken() {
  return request<{ accessToken: string }>("/auth/refresh", {
    method: "POST",
  });
}

export async function apiLogout() {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export async function apiGetMe() {
  return request<{
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    provider: "EMAIL" | "GOOGLE" | "GITHUB";
    is_verified: boolean;
    created_at: string;
  }>("/auth/me");
}

// ─── User/Profile API ───

export async function apiUpdateProfile(data: { name?: string }) {
  return request<{
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    provider: "EMAIL" | "GOOGLE" | "GITHUB";
    is_verified: boolean;
    created_at: string;
  }>("/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function apiChangePassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>("/user/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function apiSendVerification() {
  return request<{ message: string }>("/user/send-verification", {
    method: "POST",
  });
}

export async function apiVerifyEmail(code: string) {
  return request<{ message: string }>("/user/verify-email", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

// ─── OAuth URLs ───

export function getGoogleOAuthUrl() {
  return `${API_URL}/auth/google`;
}

export function getGitHubOAuthUrl() {
  return `${API_URL}/auth/github`;
}
