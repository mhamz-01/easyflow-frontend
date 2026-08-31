import type { Metadata } from "next";
import { headers } from "next/headers";
import { SidebarProvider } from "@/src/components/shadcn/sidebar";
import { AppSidebar } from "@/src/components/sidebar/app-sidebar";
import { NotificationRealtimeListener } from "@/src/components/notifications/notification-realtime-listener";
import SettingsModal from "@/src/components/modals/settings-modal";
import { isMobileUserAgent } from "@/src/lib/is-mobile-user-agent";

export const metadata: Metadata = {
  title: "EasyFlow - Built for teams who want clarity",
  description:
    "Built for teams who want clarity, speed, and focus. Your projects, tasks, documents, and whiteboards, all in one place. Collaborate smarter and let AI help you move faster.",
};

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const defaultIsMobile = isMobileUserAgent(headersList.get("user-agent"));

  return (
    <SidebarProvider defaultIsMobile={defaultIsMobile}>
      <AppSidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
      <NotificationRealtimeListener />
      <SettingsModal />
    </SidebarProvider>
  );
}
