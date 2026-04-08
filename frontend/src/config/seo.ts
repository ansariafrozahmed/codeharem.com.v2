import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

// ─── Core Site Config ────────────────────────────────────────────────────────
export const siteConfig = {
  name: "CodeHarem",
  url: baseUrl,
  title: "CodeHarem - The Ultimate Code Hub & Developer Playground",
  description:
    "Join a vibrant community where developers showcase creativity, contribute to open-source UI components, and grow together. Browse, create, and share beautiful UI components.",
  keywords: [
    "UI components",
    "open source",
    "developer community",
    "code playground",
    "web development",
    "React components",
    "Tailwind CSS",
    "CSS components",
    "frontend development",
    "code sharing",
  ],
  author: "CodeHarem",
  locale: "en_US",
  themeColor: "#429872",
  twitterHandle: "@codeharem",
  ogImage: "/og-image.webp",
} as const;

// ─── Robots Config ───────────────────────────────────────────────────────────
export const robotsConfig = {
  disallowPaths: ["/profile", "/settings", "/my-components", "/auth/", "/create"],
  allowPaths: ["/"],
} as const;

// ─── Page Metadata Templates ─────────────────────────────────────────────────
// Use these to generate consistent metadata across pages

export const pagesSeo = {
  home: {
    title: siteConfig.title,
    description: siteConfig.description,
  },
  components: {
    title: "UI Components - CodeHarem",
    description:
      "Browse community-built UI components. Buttons, modals, forms, cards, and more — built with Tailwind CSS and vanilla CSS.",
  },
  blog: {
    title: "Blog - CodeHarem",
    description:
      "Read articles about web development, UI design, CSS tricks, and more from the CodeHarem community.",
  },
  playground: {
    title: "Playground - CodeHarem",
    description:
      "Experiment with HTML, CSS, and JavaScript in real-time. Build and preview UI components instantly.",
  },
  login: {
    title: "Login - CodeHarem",
    description: "Sign in to CodeHarem to create, share, and manage your UI components.",
  },
  register: {
    title: "Register - CodeHarem",
    description: "Join CodeHarem — a community of developers creating and sharing beautiful UI components.",
  },
} as const;

// ─── Metadata Helpers ────────────────────────────────────────────────────────

/**
 * Build a full Metadata object for any page.
 * Merges page-specific values with site-wide defaults (OG, Twitter, canonical).
 */
export function buildMetadata(options: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}): Metadata {
  const { title, description, path, ogImage, ogType = "website", noIndex, article } = options;
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const image = ogImage || siteConfig.ogImage;
  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    ...(path && { alternates: { canonical: url } }),
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(article && ogType === "article"
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.author ? [article.author] : undefined,
            tags: article.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
  };
}

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/component?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.webp`,
  };
}

export function getBlogPostJsonLd(blog: {
  title: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string | null;
  createdAt: string;
  updatedAt?: string;
  author?: { name: string; avatar?: string | null };
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    url: `${siteConfig.url}/blog/${blog.slug}`,
    ...(blog.featuredImage && { image: blog.featuredImage }),
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    ...(blog.author && {
      author: {
        "@type": "Person",
        name: blog.author.name,
        ...(blog.author.avatar ? { image: blog.author.avatar } : {}),
      },
    }),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.webp` },
    },
    ...(blog.tags && blog.tags.length > 0 && { keywords: blog.tags.join(", ") }),
  };
}

export function getComponentJsonLd(component: {
  title: string;
  slug: string;
  category: string;
  styling: string;
  createdAt: string;
  author?: { name: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: component.title,
    url: `${siteConfig.url}/component/${component.slug}`,
    description: `A ${component.category} component built with ${component.styling === "tailwind" ? "Tailwind CSS" : "CSS"}`,
    programmingLanguage: ["HTML", "CSS", component.styling === "tailwind" ? "Tailwind CSS" : "CSS"],
    dateCreated: component.createdAt,
    ...(component.author && {
      author: { "@type": "Person", name: component.author.name },
    }),
  };
}

export function getProfileJsonLd(profile: {
  name: string;
  username: string;
  avatar?: string | null;
  componentCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      url: `${siteConfig.url}/profile/${profile.username}`,
      ...(profile.avatar ? { image: profile.avatar } : {}),
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CreateAction",
        userInteractionCount: profile.componentCount,
      },
    },
  };
}
