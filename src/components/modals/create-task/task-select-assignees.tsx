import { UserRoundSearch } from "lucide-react";
import { Field } from "../../shadcn/field";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskPopover from "./task-popover";
import TaskDropdown from "./task-dropdown";
import { getWorkspaceMembers } from "@/src/lib/api/workspace/members/services";
import DropdownSearchInput from "../../dropdown-search-input";

/* ---------------------------------- */
/* Loading Skeleton */
/* ---------------------------------- */
const MembersSkeleton = () => {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-md p-2 animate-pulse"
        >
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
};

const TaskSelectAssignees = () => {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ["workspaceMembers", workspace?.id],
    queryFn: () => getWorkspaceMembers({ workspaceId: workspace?.id! }),
    enabled: !!workspace?.id,
  });

  const members = membersData?.members ?? [];

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.User.username?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, members]);

  return (
    <TaskPopover
      inputName="assignees"
      Icon={UserRoundSearch}
      iconClassName="text-purple-500"
      side="top"
    >
      <Field className="relative">
        <DropdownSearchInput
          search={search}
          setSearch={setSearch}
          setIsOpen={setIsOpen}
        />

        {/* 🔄 LOADING */}
        {isMembersLoading && isOpen && <MembersSkeleton />}

        {/* ❌ ERROR */}
        {isMembersError && isOpen && (
          <div className="p-3 text-sm text-red-500">Failed to load members</div>
        )}

        <TaskDropdown
          items={filteredMembers}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          inputName="assignees"
          getImageSrc={(item) => item.User.imageUrl ?? ""}
          getId={(item) => item.User.id}
          getLabel={(item) => item.User.username}
        />
      </Field>
    </TaskPopover>
  );
};

export default TaskSelectAssignees;
