import GlobalLoader from "@/src/components/custom/global-loader";

// Next's default Suspense fallback for every route segment — covers the
// marketing site, sign-in/sign-up, onboarding, etc. The authenticated app
// shell opts out via its own loading.tsx (it has persistent chrome — a
// sidebar — that shouldn't be replaced by a full-screen loader on every nav).
export default function Loading() {
  return <GlobalLoader />;
}
