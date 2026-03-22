"use client";

import { ReactNode } from "react";
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
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] gap-5 px-4 py-5 lg:px-6 lg:py-6">
      <Sidebar />
      <div className="flex min-h-full flex-1 flex-col gap-4">
        <Header title={title} description={description} action={action} />
        <main className="flex-1 pb-6">{children}</main>
      </div>
    </div>
  );
}
