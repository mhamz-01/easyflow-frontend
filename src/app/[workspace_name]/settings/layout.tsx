import type { Metadata } from "next";
import "@/src/app/globals.css";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/shadcn/sidebar";
import { SettingsSidebar } from "@/src/components/sidebar/settings-sidebar";
import SettingsHeaderBreadcrums from "@/src/components/custom/settings-header-breadcrums";

export const metadata: Metadata = {
  title: "EasyFlow - Built for teams who want clarity",
  description:
    "Built for teams who want clarity, speed, and focus. Your projects, tasks, documents, and whiteboards, all in one place. Collaborate smarter and let AI help you move faster.",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <main className="w-full p-4">
        <SidebarTrigger className="inline-flex md:hidden text-gray-200 mb-2" />
        <SettingsHeaderBreadcrums />
        {children}
      </main>
    </SidebarProvider>
  );
}
