"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "./_components/landing-page";

// Returning users with a stored workspace get redirected there;
// everyone else sees the marketing page below.
const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const workspaceSlug = localStorage.getItem("workspaceSlug");

    if (workspaceSlug) {
      router.replace(`/${workspaceSlug}`);
    }
  }, [router]);

  return <LandingPage />;
};

export default Page;
