import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useWorkspaceStore } from "@/src/store/workspace";
import { getWorkspaceMembers } from "@/src/lib/api/workspace/members/services";
import Avatar from "../custom/avatar";
import DropdownSelect from "./wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";
import DropdownSearchInput from "../dropdown-search-input";
import { Button } from "../shadcn/button";

type WorkspaceMember = {
  User: {
    id: number;
    username: string;
    imageUrl?: string;
  };
};

type SelectAssigneesProps = {
  /** Controlled: selected user IDs owned by parent */
  selectedIds: number[];
  /** Called when an assignee is toggled */
  onChange: (updatedIds: number[]) => void;
  /** Max avatars to show before showing +N overflow */
  maxVisible?: number;
};

const MAX_VISIBLE_DEFAULT = 3;

function SelectAssignees({
  selectedIds,
  onChange,
  maxVisible = MAX_VISIBLE_DEFAULT,
}: SelectAssigneesProps) {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");

  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ["workspaceMembers", workspace?.id],
    queryFn: () => getWorkspaceMembers({ workspaceId: workspace?.id! }),
    enabled: !!workspace?.id,
  });

  const members: WorkspaceMember[] = membersData?.members ?? [];

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.User.username?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, members]);

  const selectedMembers = useMemo(() => {
    return members.filter((m) => selectedIds.includes(m.User.id));
  }, [members, selectedIds]);

  const visibleMembers = selectedMembers.slice(0, maxVisible);
  const overflowCount = selectedMembers.length - visibleMembers.length;

  const handleSelect = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((v) => v !== id)
      : [...selectedIds, id];
    onChange(updated);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="border-0">
        <Button
          type="button"
          variant={"ghost"}
          className="p-0"
          aria-label="Assign members"
        >
          {selectedMembers.length === 0 ? (
            <div className="flex items-center gap-1.5 text-sm">
              <UserPlus className="w-4 h-4" />
              <span>Assignees</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {visibleMembers.map((member) => (
                  <Avatar
                    key={member.User.id}
                    src={member.User.imageUrl}
                    className="w-6 h-6 ring-2 ring-background rounded-full"
                    width={24}
                    height={24}
                    alt={member.User.username}
                  />
                ))}
              </div>
              {overflowCount > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground font-medium">
                  +{overflowCount}
                </span>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <DropdownSearchInput search={search} setSearch={setSearch} />
        {isMembersLoading ? (
          <p className="text-sm px-4 py-3 text-muted-foreground">Loading...</p>
        ) : isMembersError ? (
          <p className="text-sm px-4 py-3 text-destructive">
            Failed to load members
          </p>
        ) : (
          <DropdownSelect<WorkspaceMember>
            items={filteredMembers}
            isOpen={true}
            setIsOpen={() => {}}
            selectedValues={selectedIds}
            onSelect={(id) => handleSelect(id)}
            getId={(m) => m.User.id}
            getLabel={(m) => m.User.username}
            getImageSrc={(m) => m.User.imageUrl ?? ""}
            selectionLabel="assignee(s) selected"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export default SelectAssignees;
