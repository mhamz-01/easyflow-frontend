interface RowCellProps {
  children: React.ReactNode;
  className?: string;
  justify?: "start" | "between";
  commonClass: string;
}

export const RowCell = ({
  children,
  className,
  justify = "between",
  commonClass,
}: RowCellProps) => {
  const justifyClass =
    justify === "between" ? "justify-between" : "justify-start";

  return (
    <div className={`${commonClass} ${justifyClass} ${className ?? ""}`}>
      {children}
    </div>
  );
};
