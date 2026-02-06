"use client";

import {
  ChevronDown,
  LogOut,
  LogOutIcon,
  Mails,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../shadcn/button";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/src/hooks/use-outside-click";
import { truncateWord } from "@/src/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/src/lib/api/workspace/services";
import { workspaceKeys } from "@/src/lib/api/workspace/keys";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/src/store/workspace";
import { workspaceItemProps } from "@/src/types/workspace";
import WorkspaceIcon from "./workspace-icon";
import WorkspaceMenuItemSkeleton from "./workspace-menu-item-skeleton";
import WorkspaceMenuItem from "./workspace-menu-item";
import WorkspaceInvitationButton from "./workspace-invitation-button";

// workspace dropdown
const WorkspaceDrodownMenu = () => {
  // states
  const { setWorkspace, updateWorkspace } = useWorkspaceStore();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // get current path
  const [currentWorkspace, setCurrentWorkspace] =
    useState<workspaceItemProps | null>();

  // fetch workspaces
  const { data: workspaces, isLoading } = useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: getWorkspaces,
  });
  const { signOut } = useClerk();

  // determine current workspace slug from URL
  const currentWorkspaceSlug = pathname?.split("/").filter(Boolean)[0] || "";

  useEffect(() => {
    // find the workspace for the current slug from list of workspaces fetched
    const currentWorkspace =
      workspaces?.data?.find(
        (workspace: workspaceItemProps) =>
          workspace.workspaceSlug === currentWorkspaceSlug,
      ) || null;

    // if current workspace exists
    if (currentWorkspace) {
      setCurrentWorkspace(currentWorkspace);
      // set workspace to global state
      setWorkspace({
        id: currentWorkspace.id,
        workspaceName: currentWorkspace.workspaceName,
        admin: currentWorkspace.admin,
        workspaceSlug: currentWorkspace.workspaceSlug,
      });

      // store workspaceSlug in localStorage
      localStorage.setItem("workspaceSlug", currentWorkspace.workspaceSlug);
    }
  }, [workspaces, currentWorkspaceSlug]);

  useEffect(() => {
    if (currentWorkspaceSlug) {
      // only update workspaceSlug in workspace state
      updateWorkspace({ workspaceSlug: currentWorkspaceSlug });

      // store workspaceSlug in localStorage
      localStorage.setItem("workspaceSlug", currentWorkspaceSlug);
    }
  }, [pathname, currentWorkspaceSlug]);

  useOutsideClick(modalRef, triggerRef, () => setOpen(false));

  return (
    <div className="relative">
      {/* dropdown trigger */}
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="group/dropdown-trigger max-w-50 flex gap-2 items-center px-2 py-2 border border-gray-50 rounded hover:cursor-pointer"
      >
        <WorkspaceIcon
          character={currentWorkspace?.workspaceName?.[0] || "W"}
        />
        <h1 className="text-nowrap select-none text-sm capitalize">
          {truncateWord(
            currentWorkspace?.workspaceName || "Fetching workspace...",
            15,
          )}
        </h1>
        <ChevronDown size={14} className="min-w-4" />
      </div>

      {/* dropdown menu */}
      <div
        ref={modalRef}
        className={`absolute left-0 top-12 z-10 w-75 max-h-[calc(100vh-6rem)] overflow-y-auto border border-gray-50 rounded bg-background shadow-xl py-2 transition-all duration-300 ease-in-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <p className="text-sm text-gray-200 px-4 py-2">
          {user?.primaryEmailAddress?.emailAddress}
        </p>
        {/* workspace items */}
        {isLoading
          ? [1, 2, 3].map((item) => <WorkspaceMenuItemSkeleton key={item} />)
          : workspaces &&
            workspaces.data?.map((workspace: workspaceItemProps) => (
              <WorkspaceMenuItem
                key={workspace.workspaceName}
                workspace={workspace}
              />
            ))}
        {/* buttons */}
        <div className="mx-4 my-3">
          {/* create workspace button */}
          <Link className="cursor-pointer" href={"/create-workspace"}>
            <Button size={"sm"} className="" variant={"ghost"}>
              <PlusCircle /> Create workspace
            </Button>
          </Link>
          {/* Worskapce Invitations button */}
          <WorkspaceInvitationButton />
          {/* sign out button */}
          <Button
            variant={"ghost"}
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-red-600"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDrodownMenu;
