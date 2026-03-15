import { request, API_URL } from "../api";

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

export function getGoogleOAuthUrl() {
  return `${API_URL}/auth/google`;
}

export function getGitHubOAuthUrl() {
  return `${API_URL}/auth/github`;
}
