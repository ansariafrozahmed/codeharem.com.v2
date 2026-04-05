import { request } from "../api";

export interface BlogData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  tags: string[];
  category: string;
  status: "draft" | "published";
  views: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  author?: { name: string; avatar: string | null; username: string | null };
}

export interface BlogListResponse {
  blogs: BlogData[];
  total: number;
  page: number;
  totalPages: number;
}

export async function apiListBlogs(options?: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.tag) params.set("tag", options.tag);
  if (options?.search) params.set("search", options.search);
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  const qs = params.toString();
  return request<BlogListResponse>(`/blogs${qs ? `?${qs}` : ""}`);
}

export async function apiGetBlog(slug: string) {
  return request<BlogData>(`/blogs/${slug}`);
}

export async function apiIncrementBlogViews(slug: string) {
  return request<{ message: string }>(`/blogs/${slug}/views`, {
    method: "POST",
  });
}
