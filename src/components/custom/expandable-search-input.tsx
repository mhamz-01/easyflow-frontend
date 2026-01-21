import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ExpandableSearchInput = () => {
  const [openInput, setOpenInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // autofocus when opened
  useEffect(() => {
    if (openInput) {
      inputRef.current?.focus();
    }
  }, [openInput]);

  return (
    <div className="flex items-center justify-end">
      <div className="relative flex items-center">
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className={`
              h-9 rounded-md bg-muted/40 px-3 text-sm text-white
              outline-none transition-all duration-300 ease-in-out
              ${openInput ? "w-[150px] opacity-100 mr-2" : "w-0 opacity-0 mr-0"}
              pointer-events-${openInput ? "auto" : "none"}
            `}
        />

        {/* Icon */}
        <button
          type="button"
          onClick={() => setOpenInput((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-md
              hover:bg-muted/40 transition-colors"
        >
          <Search size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ExpandableSearchInput;
