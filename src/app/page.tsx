"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const workspaceSlug = localStorage.getItem("workspaceSlug");

    if (workspaceSlug) {
      router.replace(`/${workspaceSlug}`);
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
};

export default Page;
