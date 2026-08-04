import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import GlobalLoader from "@/src/components/custom/global-loader";

export default function Page() {
  // Handle the redirect flow by calling the Clerk.handleRedirectCallback() method
  // or rendering the prebuilt <AuthenticateWithRedirectCallback/> component.
  // That component renders no UI of its own, so without a loader this page
  // is just a blank/grey screen for the second or so it takes to finish.
  return (
    <>
      <AuthenticateWithRedirectCallback />
      <GlobalLoader message="Signing you in…" />

      {/* Required for sign-up flows. Clerk's bot sign-up protection is
      enabled by default — kept in normal flow (not under the loader) so an
      interactive challenge, if one is triggered, still has room to render. */}
      <div id="clerk-captcha" />
    </>
  );
}
