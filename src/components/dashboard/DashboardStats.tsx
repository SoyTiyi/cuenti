import { formatCurrency } from "@/lib/utils/formatters";
import type { SaleStats } from "@/lib/types/sale/type";

interface DashboardStatsProps {
  stats: SaleStats;
  isLoading: boolean;
}

const STAT_ITEMS = [
  { key: "monthSalesCount", label: "Ventas del mes", color: "text-primary-600", isCurrency: false },
  { key: "collectedAmount", label: "Recaudado", color: "text-success-600", isCurrency: true },
  { key: "pendingAmount", label: "Por cobrar", color: "text-warning-600", isCurrency: true },
  { key: "collectionRate", label: "Tasa de cobro", color: "text-neutral-500", isCurrency: false },
] as const;

function getCollectionRate(stats: SaleStats): string {
  if (stats.totalAmount === 0) return "0%";
  return `${Math.round((stats.collectedAmount / stats.totalAmount) * 100)}%`;
}

function getStatValue(key: string, stats: SaleStats, isCurrency: boolean): string {
  if (key === "collectionRate") return getCollectionRate(stats);
  const value = stats[key as keyof SaleStats];
  return isCurrency ? formatCurrency(value) : String(value);
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STAT_ITEMS.map(({ key, label, color, isCurrency }) => (
        <div key={key} className="bg-white rounded-xl shadow-sm p-5">
          <p className={`text-xs uppercase tracking-wide font-medium ${color}`}>{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {isLoading ? "..." : getStatValue(key, stats, isCurrency)}
          </p>
        </div>
      ))}
    </div>
  );
}
