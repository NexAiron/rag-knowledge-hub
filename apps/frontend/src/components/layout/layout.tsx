"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface LayoutProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Layout({ title, description, action, children }: LayoutProps) {
  return (
    <ProtectedRoute>
      <div className="mx-auto flex min-h-screen w-full max-w-[1360px] gap-4 px-4 py-4 lg:gap-5 lg:px-5 lg:py-5 2xl:max-w-[1440px] 2xl:px-6 2xl:py-6">
        <Sidebar />
        <div className="flex min-h-full flex-1 flex-col gap-4">
          <Header title={title} description={description} action={action} />
          <main className="flex-1 pb-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
