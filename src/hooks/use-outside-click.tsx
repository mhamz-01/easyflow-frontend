import { useEffect } from "react";

/**
 * useOutsideClick
 * -------------------------------
 * A reusable hook that detects clicks outside of a passed DOM element (via ref) and triggers a callback function.
 *
 * @param ref - The element you want to monitor clicks outside of
 * @param onOutsideClick - Function called when a click occurs outside the element
 */
export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  onOutsideClick: () => void
) => {
  useEffect(() => {
    /**
     * Handles mouse click events.
     * If the click target is NOT inside the referenced element,
     * run the provided callback.
     */
    function handleClick(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        onOutsideClick();
      }
    }

    // Start listening for clicks anywhere on the document
    document.addEventListener("mousedown", handleClick);

    // Cleanup to prevent memory leaks
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onOutsideClick]);
};
