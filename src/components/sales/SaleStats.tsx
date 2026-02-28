import { formatCurrency } from "@/lib/utils/formatters";
import type { SaleStats as SaleStatsType } from "@/lib/types/sale/type";

interface SaleStatsProps {
  stats: SaleStatsType;
  isLoading: boolean;
}

const STAT_ITEMS = [
  { key: "totalAmount", label: "Total Ventas", color: "text-neutral-500" },
  { key: "collectedAmount", label: "Recaudado", color: "text-success-600" },
  { key: "pendingAmount", label: "Por Cobrar", color: "text-warning-600" },
] as const;

export function SaleStats({ stats, isLoading }: SaleStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {STAT_ITEMS.map(({ key, label, color }) => (
        <div key={key} className="bg-white rounded-xl shadow-sm p-5">
          <p className={`text-xs uppercase tracking-wide font-medium ${color}`}>{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {isLoading ? "..." : formatCurrency(stats[key])}
          </p>
        </div>
      ))}
    </div>
  );
}
