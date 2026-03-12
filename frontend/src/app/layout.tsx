import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Bricolage_Grotesque } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "CodeHarem - The Ultimate Code Hub & Developer Playground",
  description:
    "Join a vibrant community where developers showcase creativity, contribute to open-source UI, and grow together.",
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
