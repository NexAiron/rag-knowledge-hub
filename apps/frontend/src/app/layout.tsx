import type { Metadata } from "next";
import "./globals.css";
import "antd/dist/reset.css";
import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { AntdProvider } from "@/components/providers/antd-provider";
import { ThemeBootstrap } from "@/components/theme/theme-bootstrap";

export const metadata: Metadata = {
  title: "NexAiron RAG Hub",
  description: "RAG knowledge base QA frontend",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
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
