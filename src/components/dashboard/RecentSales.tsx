import { Loader2, Receipt } from "lucide-react";
import { ClientAvatar, StatusBadge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { Sale } from "@/lib/types/sale/type";

interface RecentSalesProps {
  sales: Sale[];
  isLoading: boolean;
}

export function RecentSales({ sales, isLoading }: RecentSalesProps) {
  const recentSales = sales.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Actividad reciente</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-primary-400" />
        </div>
      ) : recentSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
          <Receipt size={24} className="mb-2" />
          <p className="text-sm">No hay ventas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentSales.map((sale) => (
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
                <p className="text-xs text-neutral-500 mt-0.5">
                  {formatDate(sale.saleDate)}
                </p>
              </div>
              <StatusBadge isPaid={sale.isPaid} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
