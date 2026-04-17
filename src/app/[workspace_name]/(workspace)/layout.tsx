import type { Metadata } from "next";
import { SidebarProvider } from "@/src/components/shadcn/sidebar";
import { AppSidebar } from "@/src/components/sidebar/app-sidebar";

export const metadata: Metadata = {
  title: "EasyFlow - Built for teams who want clarity",
  description:
    "Built for teams who want clarity, speed, and focus. Your projects, tasks, documents, and whiteboards, all in one place. Collaborate smarter and let AI help you move faster.",
};

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-[768px]:w-[calc(100%-16rem)]">
        {children}
      </main>
    </SidebarProvider>
  );
}
