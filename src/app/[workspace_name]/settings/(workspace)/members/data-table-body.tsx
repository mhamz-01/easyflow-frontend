"use client";

import { TableBody, TableRow } from "@/src/components/shadcn/table";

export interface DataTableBodyProps<T> {
  /** Array of data objects to render */
  data: T[];
  /** Function to render a row for each item */
  renderRow: (item: T) => React.ReactNode;
  /** Function to get a unique key for each row (default: index) */
  getRowKey?: (item: T, index: number) => string | number;
}

export default function DataTableBody<T>({
  data,
  renderRow,
  getRowKey,
}: DataTableBodyProps<T>) {
  return (
    <TableBody>
      {data.map((item, index) => (
        <TableRow key={getRowKey ? getRowKey(item, index) : index}>
          {renderRow(item)}
        </TableRow>
      ))}
    </TableBody>
  );
}
