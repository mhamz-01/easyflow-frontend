"use client";
import AddStickyNoteButton from "@/src/components/custom/sticky-note-editor/add-sticky";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";
import { useWorkspaceStore } from "@/src/store/workspace";
import Link from "next/link";

const StickyNotesPageHeader = () => {
  const workspace = useWorkspaceStore((s) => s.workspace);
  return (
    <div className="flex justify-between items-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${workspace?.workspaceSlug}`}>
                {workspace?.workspaceName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">Sticky Notes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AddStickyNoteButton />
    </div>
  );
};

export default StickyNotesPageHeader;
