"use client";

import { useState } from "react";
import { Home, Inbox, MessageSquare } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/src/components/shadcn/sidebar";
import Link from "next/link";
import SidebarProjects from "./sidebar-projects";
import WorkspaceDrodownMenu from "../../modals/workspace-dropdown-menu";
import UserAccountMenu from "../../modals/user-account-menu";
import ComingSoonModal from "../../modals/coming-soon-modal";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useChatUnread, hasAnyUnread } from "@/src/hooks/use-chat-unread";

// main menu items
const mainItems = [
  {
    title: "Home",
    icon: Home,
    type: "link",
    path: "",
  },
  {
    title: "Chat",
    icon: MessageSquare,
    type: "link",
    path: "/chat",
  },
  {
    title: "Inbox",
    icon: Inbox,
    type: "modal",
    path: "",
  },
] as const;

export function AppSidebar() {
  const workspace = useWorkspaceStore((state) => state.workspace);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const { data: unreadChannels } = useChatUnread(workspace?.id);
  const chatUnread = hasAnyUnread(unreadChannels);

  return (
    <Sidebar>
      {/* sidebar header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <WorkspaceDrodownMenu />
            <UserAccountMenu floatRight />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* sidebar content */}
      <SidebarContent>
        {/* main items */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) =>
                item.type === "modal" ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => setComingSoonOpen(true)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={`/${workspace?.workspaceSlug ?? ""}${item.path}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Chat" && chatUnread && (
                      <span
                        aria-label="Unread messages"
                        className="absolute top-1/2 right-2 size-2 -translate-y-1/2 rounded-full bg-destructive"
                      />
                    )}
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* projects */}
        <SidebarProjects />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="items-end">
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <ComingSoonModal
        open={comingSoonOpen}
        onOpenChange={setComingSoonOpen}
        title="Inbox Coming Soon"
        body="We're building Inbox right now so you can get notified on task updates, mentions, and project activity in one place."
      />
    </Sidebar>
  );
}