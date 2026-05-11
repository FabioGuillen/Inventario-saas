import type { Column } from "../types/types";

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
}: TableProps<T>) => {
  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-[#121212] border-b border-[#2A2A2A]">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 font-semibold text-gray-300">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-400"
                >
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[#2A2A2A] hover:bg-[#181818] transition"
                >
                  {columns.map((col, j) => {
                    const value = col.accessor
                      ? row[col.accessor as keyof T]
                      : null;

                    return (
                      <td key={j} className="px-4 py-3">
                        {col.render ? col.render(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            No hay datos disponibles
          </div>
        ) : (
          data.map((row, i) => (
            <div
              key={i}
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4 space-y-3"
            >
              {columns.map((col, j) => {
                const value = col.accessor
                  ? row[col.accessor as keyof T]
                  : null;

                return (
                  <div key={j} className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400">{col.header}</span>

                    <div className="text-sm text-white break-words">
                      {col.render ? col.render(value, row) : value}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Table;
