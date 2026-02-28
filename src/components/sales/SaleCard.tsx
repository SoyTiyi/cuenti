import { useState } from "react";
import { Check, MessageCircle, Eye, Package, Loader2 } from "lucide-react";
import { ClientAvatar, StatusBadge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { Sale } from "@/lib/types/sale/type";

interface SaleCardProps {
  sale: Sale;
  onMarkAsPaid: (id: number) => Promise<boolean>;
}

export function SaleCard({ sale, onMarkAsPaid }: SaleCardProps) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsPaid = async () => {
    if (sale.isPaid) return;
    setIsMarking(true);
    await onMarkAsPaid(sale.id);
    setIsMarking(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <ClientAvatar name={sale.client.name} />
          <div className="min-w-0">
            <p className="font-medium text-neutral-900 truncate">{sale.client.name}</p>
            <p className="text-xs text-neutral-500">{formatDate(sale.saleDate)}</p>
          </div>
        </div>
        <StatusBadge isPaid={sale.isPaid} />
      </div>

      {/* Service */}
      <div className="flex items-center gap-2 text-neutral-600">
        <Package size={14} className="text-neutral-400 flex-shrink-0" />
        <span className="text-sm truncate">{sale.service.name}</span>
      </div>

      {/* Amount */}
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-wide">Monto Total</p>
        <p className="text-2xl font-bold text-neutral-900">{formatCurrency(Number(sale.amount))}</p>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-neutral-100">
        {sale.isPaid ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-success-600">
              <Check size={16} />
              <span className="text-sm font-medium">Pagada</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-success-600 hover:bg-success-50 rounded-lg transition-colors cursor-pointer">
              <MessageCircle size={15} />
              Recibo
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <Eye size={18} />
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-warning-600 hover:bg-warning-50 rounded-lg transition-colors cursor-pointer">
                <MessageCircle size={15} />
                Recordar
              </button>
              <button
                onClick={handleMarkAsPaid}
                disabled={isMarking}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                {isMarking ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Marcar pagada
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
