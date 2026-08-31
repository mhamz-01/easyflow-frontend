"use client";

import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/shadcn/tabs";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import Avatar from "@/src/components/custom/avatar";
import { accountMenuItems, workspaceMenuItems } from "@/src/constants/sidebar";
import {
  SettingsSection,
  SettingsTab,
  useSettingsModalStore,
} from "@/src/store/useSettingsModalStore";

import Profile from "@/src/app/[workspace_name]/settings/(account)/profile/page";
import NotifcationsSetting from "@/src/app/[workspace_name]/settings/(account)/notifications/page";
import GeneralSettings from "@/src/app/[workspace_name]/settings/(workspace)/general/page";
import MembersSettings from "@/src/app/[workspace_name]/settings/(workspace)/members/page";

const sectionContent: Record<SettingsSection, { title: string; render: () => React.ReactNode }> = {
  profile: { title: "Profile", render: () => <Profile /> },
  notifications: { title: "Notifications", render: () => <NotifcationsSetting /> },
  general: { title: "General", render: () => <GeneralSettings /> },
  members: { title: "Members", render: () => <MembersSettings /> },
};

const SettingsModal = () => {
  const { user, isLoaded } = useUser();
  const { isOpen, tab, section, closeSettings, setTab, setSection } =
    useSettingsModalStore();

  const menuItems = tab === "account" ? accountMenuItems : workspaceMenuItems;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent
        showCloseButton
        className="flex h-[90vh] max-h-[720px] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="flex shrink-0 flex-col border-b bg-sidebar sm:w-56 sm:border-b-0 sm:border-r">
            <div className="flex items-center gap-2 px-4 pb-3 pt-5">
              <Avatar src={user?.imageUrl} width={28} height={28} />
              {isLoaded ? (
                <h1 className="truncate text-sm font-medium">{user?.fullName}</h1>
              ) : (
                <Skeleton className="h-4 w-24" />
              )}
            </div>

            <div className="px-3">
              <Tabs value={tab}>
                <TabsList className="w-full">
                  <TabsTrigger value="account" onClick={() => setTab("account")}>
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="workspace" onClick={() => setTab("workspace")}>
                    Workspace
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <nav className="mt-3 flex gap-1 overflow-x-auto px-3 pb-3 sm:flex-col sm:gap-0.5 sm:overflow-visible sm:pb-0">
              {menuItems.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => setSection(item.url as SettingsSection)}
                  className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    section === item.url
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b px-6 py-4">
              <h2 className="text-lg font-semibold">{sectionContent[section].title}</h2>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              {sectionContent[section].render()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
