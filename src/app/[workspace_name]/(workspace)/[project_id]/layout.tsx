"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";
import { Button } from "@/src/components/shadcn/button";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectMembershipRealtime } from "@/src/lib/api/project/members/hooks";

const REDIRECT_DELAY_MS = 4000;

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams<{ workspace_name: string; project_id: string }>();
  const projectId = Number(params.project_id);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const router = useRouter();
  const homeHref = `/${workspace?.workspaceSlug ?? ""}`;

  // Keeps this project's membership badges live everywhere it's rendered,
  // and flags isRemoved for the current user themself so we can show them a
  // clear message rather than just yanking them away silently.
  const { isRemoved } = useProjectMembershipRealtime(workspace?.id, projectId);

  useEffect(() => {
    if (!isRemoved) return;
    const timer = setTimeout(() => router.push(homeHref), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isRemoved, router, homeHref]);

  if (isRemoved) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldOff className="size-8 text-muted-foreground" />
        <h2 className="text-lg font-semibold">
          You&apos;re no longer a member of this project
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          An admin removed your access. You&apos;ll be redirected shortly.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => router.push(homeHref)}>
          Go to workspace now
        </Button>
      </div>
    );
  }

  return <div>{children}</div>;
}
