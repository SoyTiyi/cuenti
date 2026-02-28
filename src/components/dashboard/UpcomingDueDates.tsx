import { useMemo } from "react";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { ClientAvatar } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { Sale } from "@/lib/types/sale/type";

interface UpcomingDueDatesProps {
  sales: Sale[];
  isLoading: boolean;
}

type DueStatus = "overdue" | "upcoming" | "no-date";

function getDueStatus(dueDate: string | null): DueStatus {
  if (!dueDate) return "no-date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  if (due < today) return "overdue";
  return "upcoming";
}

const STATUS_CONFIG: Record<DueStatus, { label: string; className: string }> = {
  overdue: { label: "Vencida", className: "bg-danger-100 text-danger-700" },
  upcoming: { label: "Próxima", className: "bg-warning-100 text-warning-700" },
  "no-date": { label: "Sin fecha", className: "bg-neutral-100 text-neutral-500" },
};

export function UpcomingDueDates({ sales, isLoading }: UpcomingDueDatesProps) {
  const pendingSales = useMemo(() => {
    return sales
      .filter((s) => !s.isPaid)
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);
  }, [sales]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Próximos vencimientos</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-primary-400" />
        </div>
      ) : pendingSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
          <AlertCircle size={24} className="mb-2" />
          <p className="text-sm">No hay ventas pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingSales.map((sale) => {
            const status = getDueStatus(sale.dueDate);
            const config = STATUS_CONFIG[status];

            return (
              <div key={sale.id} className="flex items-center gap-3">
                <ClientAvatar name={sale.client.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {sale.client.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{sale.service.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(Number(sale.amount))}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <Clock size={10} className="text-neutral-400" />
                    <span className="text-xs text-neutral-500">
                      {sale.dueDate ? formatDate(sale.dueDate) : "—"}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${config.className}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
