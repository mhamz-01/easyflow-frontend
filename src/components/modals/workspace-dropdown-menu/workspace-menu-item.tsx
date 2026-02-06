import { useWorkspaceStore } from "@/src/store/workspace";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WorkspaceIcon from "./workspace-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";
import { isAdmin, isLong, truncateWord } from "@/src/lib/utils";
import { Check, Dot, Settings, UserRoundPlus } from "lucide-react";
import { workspaceItemProps } from "@/src/types/workspace";

// workspace listing item
const WorkspaceMenuItem = ({
  workspace,
}: {
  workspace: workspaceItemProps;
}) => {
  // states
  const { updateWorkspace } = useWorkspaceStore();
  const { userId } = useAuth();
  const pathname = usePathname(); // e.g., "/workspaceSlug/anotherURL"
  const [currentWorkspaceSlug, setCurrentWorkspaceSlug] = useState("");
  const router = useRouter();
  // run when url changes
  useEffect(() => {
    if (pathname) {
      // if pathname exist
      const parts = pathname.split("/").filter(Boolean); // ["workspaceSlug", "anotherURL"]
      setCurrentWorkspaceSlug(parts[0]); // first part is the workspace slug
    }
  }, [pathname]);

  return (
    <div
      className={`flex gap-3 items-center py-2 px-4 cursor-pointer ${
        workspace.workspaceSlug === currentWorkspaceSlug ? "bg-gray-50" : ""
      }`}
    >
      <div>
        <div
          onClick={() => {
            updateWorkspace({ workspaceSlug: workspace.workspaceSlug });
            router.push("/" + workspace.workspaceSlug);
          }}
          className="flex gap-2"
        >
          <WorkspaceIcon character={workspace.workspaceName[0]} />
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-sm text-nowrap capitalize">
                    {truncateWord(workspace.workspaceName)}
                  </h1>
                </TooltipTrigger>

                {isLong(workspace.workspaceName) && (
                  <TooltipContent>
                    <p className="text-xs">{workspace.workspaceName}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {/* role & members count */}
            <div className="flex items-center text-xs">
              <p>
                {userId && isAdmin(userId, workspace.admin)
                  ? "Admin"
                  : "Member"}
              </p>
              <Dot />
              <p className="text-nowrap">
                {workspace.members === null ? 0 : workspace.members.length}{" "}
                member
              </p>
            </div>
          </div>
        </div>

        {/* setting and invite members button */}
        {userId &&
          workspace.workspaceSlug === currentWorkspaceSlug &&
          isAdmin(userId, workspace.admin) && (
            <div className="flex gap-1 mt-1">
              <Link
                href={`/${currentWorkspaceSlug}/settings/general?tab=workspace`}
                className="flex gap-2 items-center bg-black text-xs py-2 px-2 rounded"
              >
                <Settings size={16} />
                Settings
              </Link>
              <Link
                href={`/${currentWorkspaceSlug}/settings/members?tab=workspace`}
                className="flex gap-2 items-center bg-black text-xs py-2 px-2 rounded"
              >
                <UserRoundPlus size={16} />
                Invite members
              </Link>
            </div>
          )}
      </div>
      {workspace.workspaceSlug === currentWorkspaceSlug && <Check size={20} />}
    </div>
  );
};

export default WorkspaceMenuItem;
