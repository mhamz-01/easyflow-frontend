import Avatar from "./avatar";
import { UserX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/shadcn/tooltip";
import { ProjectMemberStatus } from "@/src/types/project";

type ProjectMemberAvatarProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  /** Undefined = status unknown yet (still loading, or a public project with
   * no membership rows to check against) — rendered exactly like "active". */
  status?: ProjectMemberStatus;
};

// Thin wrapper around the shared Avatar primitive — every task/doc/whiteboard/
// chat surface that renders a user already composes Avatar directly, so this
// only adds the "no longer in this project" indicator, without duplicating
// the badge/tooltip logic at each call site.
const ProjectMemberAvatar = ({ status, className = "", ...avatarProps }: ProjectMemberAvatarProps) => {
  if (status !== "removed") {
    return <Avatar className={className} {...avatarProps} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`relative inline-flex shrink-0 ${className}`}>
          <Avatar {...avatarProps} className="grayscale opacity-60" />
          <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-muted ring-2 ring-background">
            <UserX className="size-2.5 text-muted-foreground" />
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>No longer in this project</TooltipContent>
    </Tooltip>
  );
};

export default ProjectMemberAvatar;
