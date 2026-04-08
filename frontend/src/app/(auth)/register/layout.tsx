import type { Metadata } from "next";
import { buildMetadata, pagesSeo } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: pagesSeo.register.title,
  description: pagesSeo.register.description,
  path: "/register",
  noIndex: true,
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
