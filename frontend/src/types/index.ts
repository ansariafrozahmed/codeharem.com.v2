export interface ComponentCard {
  title: string;
  author: string;
  likes: number;
  views: number;
}

export interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  provider: "EMAIL" | "GOOGLE" | "GITHUB";
  is_verified: boolean;
  created_at: string;
}
