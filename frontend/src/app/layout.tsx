import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Bricolage_Grotesque } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import {
  siteConfig,
  buildMetadata,
  pagesSeo,
  getWebsiteJsonLd,
  getOrganizationJsonLd,
} from "@/config/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: pagesSeo.home.title,
    description: pagesSeo.home.description,
    path: "/",
  }),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pagesSeo.home.title,
    template: `%s | ${siteConfig.name}`,
  },
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

const codeHarem = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getWebsiteJsonLd(), getOrganizationJsonLd()]),
          }}
        />
      </head>
      <body className={`${codeHarem.className} antialiased`}>
        <NextTopLoader color="#429872" showSpinner={false} />
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
