"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/shadcn/sidebar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import UserAccountMenu from "../../modals/user-account-menu";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "../../shadcn/skeleton";
import { accountMenuItems, workspaceMenuItems } from "@/src/constants/sidebar";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWorkspaceStore } from "@/src/store/workspace";

export function SettingsSidebar() {
  // states
  const workspace = useWorkspaceStore((s) => s.workspace);
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentURL = usePathname();
  const currentPageUrl = currentURL.split("/")[3];
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    // get 'tab' value from the URL on mount and when 'searchParams' changes
    const urlTab = searchParams.get("tab") ?? "account";
    setCurrentTab(urlTab);
  }, [searchParams]);

  // handle tab change and route redirects
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    // redirect user to 'workspace's general page' if clicked on 'workspace' tab
    if (tab === "workspace") {
      router.push(`/${workspace?.workspaceSlug}/settings/general?tab=${tab}`);
    } else {
      // else redirect user to 'account's notifications page' if clicked on 'account' tab
      router.push(`/${workspace?.workspaceSlug}/settings/profile?tab=${tab}`);
    }
  };

  return (
    <Tabs value={currentTab}>
      <Sidebar>
        <SidebarHeader>
          {/* user account */}
          <div className="flex gap-2 items-center w-full mt-2">
            <UserAccountMenu floatRight={true} />
            {isLoaded ? (
              <h1 className="text-lg">{user?.fullName}</h1>
            ) : (
              <Skeleton className="w-1/2 h-4" />
            )}
          </div>
          {/* sidebar tabs */}
          <TabsList className="w-full bg-black mt-2">
            <TabsTrigger
              onClick={() => handleTabChange("account")}
              className="dark:data-[state=active]:bg-gray-50"
              value="account"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleTabChange("workspace")}
              className="dark:data-[state=active]:bg-gray-50"
              value="workspace"
            >
              Workspace
            </TabsTrigger>
          </TabsList>
        </SidebarHeader>
        {/* sidebar content */}
        <SidebarContent>
          {/* main items */}
          <SidebarMenu className="pl-2">
            {/* account sidebar menu items */}
            <TabsContent value="account">
              {accountMenuItems.map((item) => (
                <SidebarMenuItem
                  className={`${
                    item.url === currentPageUrl ? "bg-sidebar-accent" : ""
                  }`}
                  key={item.title}
                >
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/${workspace?.workspaceSlug}/settings/${item.url}?tab=${currentTab}`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </TabsContent>
            {/* workspace sidebar menu items */}
            <TabsContent value="workspace">
              {workspaceMenuItems.map((item) => (
                <SidebarMenuItem
                  className={`${
                    item.url === currentPageUrl ? "bg-sidebar-accent" : ""
                  }`}
                  key={item.title}
                >
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/${workspace?.workspaceSlug}/settings/${item.url}?tab=${currentTab}`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </TabsContent>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </Tabs>
  );
}
