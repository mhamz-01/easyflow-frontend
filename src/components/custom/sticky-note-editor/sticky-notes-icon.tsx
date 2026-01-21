export const StickyNotesIcon = () => {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-4 text-muted-foreground"
    >
      {/* back note */}
      <rect
        x="12"
        y="10"
        width="40"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.2"
      />

      {/* middle note */}
      <rect
        x="18"
        y="16"
        width="40"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.4"
      />

      {/* front note */}
      <rect
        x="24"
        y="22"
        width="40"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.7"
      />

      {/* note icon (center) */}
      <path
        d="M38 32h10v2H38v-2Zm0 5h10v2H38v-2Zm0 5h6v2h-6v-2Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
};
