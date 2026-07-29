"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/src/lib/api/workspace/services";
import GlobalLoader from "@/src/components/custom/global-loader";
import LandingPage from "./_components/landing-page";

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

// Signed-in visitors never see the landing page. This gate checks real Clerk
// auth state (not localStorage) and routes them straight to their workspace,
// or to onboarding if they don't have one yet — everyone else sees the
// marketing page below, once we're certain they're actually signed out.
const Page = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const { data, isError } = useQuery({
    queryKey: ["workspaces", "root-gate"],
    queryFn: getWorkspaces,
    enabled: isSignedIn === true,
  });

  useEffect(() => {
    if (!isSignedIn) return;
    if (data === undefined && !isError) return; // still fetching

    const workspaces = extractWorkspaces(data);

    if (isError || workspaces.length === 0) {
      router.replace("/onboarding");
      return;
    }

    const storedSlug = localStorage.getItem("workspaceSlug");
    const target = workspaces.find((w) => w.workspaceSlug === storedSlug) ?? workspaces[0];

    router.replace(`/${target.workspaceSlug}`);
  }, [isSignedIn, data, isError, router]);

  // Unknown auth state yet, or signed in and about to be redirected away.
  if (!isLoaded || isSignedIn) {
    return <GlobalLoader />;
  }

  return <LandingPage />;
};

export default Page;
