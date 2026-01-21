import Image from "next/image";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { Info, Pin, MoreVertical } from "lucide-react";
import Avatar from "@/src/components/custom/avatar";

interface whiteboard {
  id: number;
  name: string;
}

const DocsList = ({ data }: { data: whiteboard[] }) => {
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {data.map((doc: whiteboard) => (
          <li
            key={doc.id}
            className="flex items-center justify-between rounded-md border px-4 py-3"
          >
            {/* LEFT: doc icon + name */}
            <div className="flex items-center gap-3">
              <Image
                src={whiteboardIcon}
                alt="docs icon"
                width={18}
                height={18}
              />
              <span className="font-medium capitalize">{doc.name}</span>
            </div>

            {/* RIGHT: creator + separator + actions */}
            <div className="flex items-center gap-3">
              {/* creator avatar */}
              <Avatar width={24} height={24} />

              {/* separator */}
              <span className="h-5 w-px bg-border" />

              {/* actions */}
              <button className="p-1 hover:bg-muted rounded">
                <Info className="h-4 w-4" />
              </button>

              <button className="p-1 hover:bg-muted rounded">
                <Pin className="h-4 w-4" />
              </button>

              <button className="p-1 hover:bg-muted rounded">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocsList;
