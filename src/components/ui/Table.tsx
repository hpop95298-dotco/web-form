import { cn } from '@/utils';

// ── Generic Column ────────────────────────────
export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T extends object>({
  columns, data, keyField, loading, emptyMessage = 'لا توجد بيانات', onRowClick, className,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-200', className)}>
      <table className="w-full text-sm">
        {/* Header */}
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={col.width ? { width: col.width } : undefined}
                className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-slate-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors duration-100',
                  onRowClick && 'cursor-pointer hover:bg-slate-50',
                )}
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-right text-slate-700 whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as any)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
