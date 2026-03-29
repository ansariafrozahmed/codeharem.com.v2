import { request } from "../api";
import type { ComponentData } from "./component.service";

export interface PublicProfile {
  id: string;
  name: string | null;
  username: string;
  avatar: string | null;
  created_at: string;
  components: ComponentData[];
}

export async function apiGetPublicProfile(username: string) {
  return request<PublicProfile>(`/user/profile/${username}`);
}

export async function apiUpdateProfile(data: { name?: string; username?: string }) {
  return request<{
    id: string;
    email: string;
    name: string | null;
    username: string | null;
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
