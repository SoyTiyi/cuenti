import { Package, TrendingUp, Sparkles, ShoppingCart } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { ServiceWithStats } from "@/lib/types/service/types";

interface ServiceCardProps {
  service: ServiceWithStats;
  isBestSeller: boolean;
  onClick: (service: ServiceWithStats) => void;
}

function getBadge(service: ServiceWithStats, isBestSeller: boolean) {
  if (isBestSeller && service.salesCount > 0) {
    return { label: "Más vendido", bg: "bg-primary-100", text: "text-primary-700", Icon: TrendingUp };
  }
  const daysSinceCreation = (Date.now() - new Date(service.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 7) {
    return { label: "Nuevo", bg: "bg-success-100", text: "text-success-700", Icon: Sparkles };
  }
  if (service.salesCount === 0) {
    return { label: "Sin ventas", bg: "bg-neutral-100", text: "text-neutral-500", Icon: ShoppingCart };
  }
  return null;
}

export function ServiceCard({ service, isBestSeller, onClick }: ServiceCardProps) {
  const badge = getBadge(service, isBestSeller);

  return (
    <div
      onClick={() => onClick(service)}
      className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-primary-700" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 truncate">{service.name}</p>
            <p className="text-sm font-bold text-primary-600">{formatCurrency(Number(service.price))}</p>
          </div>
        </div>
        {badge && (
          <span className={`flex items-center gap-1 px-2 py-1 ${badge.bg} ${badge.text} rounded-full text-xs font-medium flex-shrink-0`}>
            <badge.Icon size={11} />
            {badge.label}
          </span>
        )}
      </div>

      {/* Description */}
      {service.description && (
        <p className="text-sm text-neutral-500 line-clamp-2">{service.description}</p>
      )}

      {/* Footer stats */}
      <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide">Ventas</p>
          <p className="text-sm font-bold text-neutral-900 mt-0.5">{service.salesCount}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide">Ingresos</p>
          <p className="text-sm font-bold text-neutral-900 mt-0.5">{formatCurrency(service.totalRevenue)}</p>
        </div>
      </div>

      {/* Last sale */}
      {service.lastSaleDate && (
        <p className="text-xs text-neutral-400">
          Última venta: {formatDate(service.lastSaleDate)}
        </p>
      )}
    </div>
  );
}
