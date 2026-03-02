import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  loading,
  emptyMessage = 'No hay datos disponibles',
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  actions,
  pageSize = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="card overflow-hidden">
      {/* Header with search */}
      {(onSearchChange || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200">
          {onSearchChange && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="input-field pl-9 text-sm"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-sm text-slate-400 py-12">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-3.5 text-sm">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Mostrando {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, data.length)} de {data.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina anterior"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <span className="text-sm text-slate-600 font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina siguiente"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
