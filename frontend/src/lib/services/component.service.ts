import { request } from "../api";

export interface ComponentData {
  id: string;
  slug: string;
  title: string;
  category: string;
  styling: "css" | "tailwind";
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  headContent: string;
  externalCss: string[];
  externalJs: string[];
  status: "draft" | "published";
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  author?: { name: string; avatar: string | null };
}

export interface ComponentListResponse {
  components: ComponentData[];
  total: number;
  page: number;
  totalPages: number;
}

export async function apiCreateComponent(data: {
  title: string;
  category: string;
  styling: "css" | "tailwind";
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  headContent: string;
  externalCss: string[];
  externalJs: string[];
  status: "draft" | "published";
}) {
  return request<ComponentData>("/components", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetComponent(slug: string) {
  return request<ComponentData>(`/components/${slug}`);
}

export async function apiUpdateComponent(
  slug: string,
  data: Partial<{
    title: string;
    category: string;
    styling: "css" | "tailwind";
    htmlCode: string;
    cssCode: string;
    jsCode: string;
    headContent: string;
    externalCss: string[];
    externalJs: string[];
    status: "draft" | "published";
  }>
) {
  return request<ComponentData>(`/components/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteComponent(slug: string) {
  return request<{ message: string }>(`/components/${slug}`, {
    method: "DELETE",
  });
}

export async function apiListComponents(options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.search) params.set("search", options.search);
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  const qs = params.toString();
  return request<ComponentListResponse>(`/components${qs ? `?${qs}` : ""}`);
}

export async function apiListMyComponents(status?: "draft" | "published") {
  const qs = status ? `?status=${status}` : "";
  return request<ComponentData[]>(`/components/mine${qs}`);
}

export async function apiIncrementViews(slug: string) {
  return request<{ message: string }>(`/components/${slug}/views`, {
    method: "POST",
  });
}
