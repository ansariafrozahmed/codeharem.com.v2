import type { Metadata } from "next";
import { buildMetadata, pagesSeo } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: pagesSeo.login.title,
  description: pagesSeo.login.description,
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
