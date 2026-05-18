import { formatCell } from "@/lib/adminFormat";
import { cn } from "@/lib/utils";

interface AdminDataTableProps {
  rows: Record<string, unknown>[];
  columns?: string[];
  dense?: boolean;
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
  rowClassName?: string;
}

/** Bảng dữ liệu động từ Map JDBC (snake_case). */
export function AdminDataTable({
  rows,
  columns,
  dense,
  onRowClick,
  rowClassName,
}: AdminDataTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-slate-500 text-sm py-8 text-center border border-dashed border-slate-700 rounded-xl">
        Không có dữ liệu.
      </p>
    );
  }

  const keys =
    columns ??
    Object.keys(rows[0] as Record<string, unknown>).filter((k) => !k.startsWith("__"));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className={cn("w-full text-sm text-left", dense ? "text-xs" : "")}>
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-500 uppercase tracking-wider">
            {keys.map((k) => (
              <th key={k} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              className={cn(
                "border-b border-slate-800/80 text-slate-200",
                onRowClick && "cursor-pointer hover:bg-slate-800/50",
                rowClassName,
              )}
            >
              {keys.map((k) => (
                <td key={k} className="px-3 py-2 max-w-[240px] truncate" title={formatCell(row[k])}>
                  {formatCell(row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
