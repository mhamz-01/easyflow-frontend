"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/src/lib/api/workspace/services";
import GlobalLoader from "@/src/components/custom/global-loader";

type WorkspaceRef = { workspaceSlug: string };

// getWorkspaces() resolves to `{ data: Workspace[] }` on success but a bare
// `[]` on error (see services.ts) — normalize both shapes here.
const extractWorkspaces = (result: unknown): WorkspaceRef[] => {
  if (Array.isArray(result)) return result;
  if (result && typeof result === "object" && Array.isArray((result as { data?: unknown }).data)) {
    return (result as { data: WorkspaceRef[] }).data;
  }
  return [];
};

// Dedicated gate for authenticated entry points (post sign-in/up, "Home"
// links, etc). Routes signed-in users to their workspace, or to onboarding
// if they don't have one yet. Signed-out visitors go to the landing page.
const HomePage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const { data, isError } = useQuery({
    queryKey: ["workspaces", "home-gate"],
    queryFn: getWorkspaces,
    enabled: isSignedIn === true,
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/");
      return;
    }

    if (data === undefined && !isError) return; // still fetching

    const workspaces = extractWorkspaces(data);

    if (isError || workspaces.length === 0) {
      router.replace("/onboarding");
      return;
    }

    const storedSlug = localStorage.getItem("workspaceSlug");
    const target = workspaces.find((w) => w.workspaceSlug === storedSlug) ?? workspaces[0];

    router.replace(`/${target.workspaceSlug}`);
  }, [isLoaded, isSignedIn, data, isError, router]);

  return <GlobalLoader />;
};

export default HomePage;
