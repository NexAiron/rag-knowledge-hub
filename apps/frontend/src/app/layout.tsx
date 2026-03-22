import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_SC, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "NexAiron RAG Hub",
  description: "RAG knowledge base QA frontend",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${plusJakartaSans.variable} ${notoSansSc.variable} font-sans antialiased`}
      >
        <AuthBootstrap />
        {children}
      </body>
    </html>
  );
}
