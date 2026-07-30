// Opts the authenticated app shell out of the root GlobalLoader fallback —
// the sidebar/layout should stay mounted between in-app navigations instead
// of being replaced by a full-screen loader; individual views handle their
// own loading state with local skeletons.
export default function Loading() {
  return null;
}
