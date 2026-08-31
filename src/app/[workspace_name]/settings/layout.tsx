import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/shadcn/sidebar";
import { SettingsSidebar } from "@/src/components/sidebar/settings-sidebar";
import SettingsHeaderBreadcrums from "@/src/components/custom/settings-header-breadcrums";
import SettingsModal from "@/src/components/modals/settings-modal";
import { isMobileUserAgent } from "@/src/lib/is-mobile-user-agent";

export const metadata: Metadata = {
  title: "EasyFlow - Built for teams who want clarity",
  description:
    "Built for teams who want clarity, speed, and focus. Your projects, tasks, documents, and whiteboards, all in one place. Collaborate smarter and let AI help you move faster.",
};

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const defaultIsMobile = isMobileUserAgent(headersList.get("user-agent"));

  return (
    <SidebarProvider defaultIsMobile={defaultIsMobile}>
      <SettingsSidebar />
      <main className="w-full min-[768px]:w-[calc(100%-16rem)] px-5 py-4">
        <SidebarTrigger className="inline-flex md:hidden text-gray-200 mb-2" />
        <SettingsHeaderBreadcrums />
        {children}
      </main>
      <SettingsModal />
    </SidebarProvider>
  );
}
