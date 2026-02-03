import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/shadcn/table";

type Column = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
};

interface DataTableHeaderProps {
  columns?: Column[];
}

const DEFAULT_COLUMNS: Column[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "joined", label: "Joined" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function DataTableHeader({
  columns = DEFAULT_COLUMNS,
}: DataTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className={
              column.align === "right"
                ? "text-right"
                : column.align === "center"
                  ? "text-center"
                  : undefined
            }
          >
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
