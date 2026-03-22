import type { Metadata } from "next";
import "./globals.css";
import "antd/dist/reset.css";
import { Noto_Sans_SC } from "next/font/google";
import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { AntdProvider } from "@/components/providers/antd-provider";
import { ThemeBootstrap } from "@/components/theme/theme-bootstrap";

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
        className={`${notoSansSc.variable} font-sans antialiased`}
      >
        <AntdRegistry>
          <AntdProvider>
            <ThemeBootstrap />
            <AuthBootstrap />
            {children}
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
