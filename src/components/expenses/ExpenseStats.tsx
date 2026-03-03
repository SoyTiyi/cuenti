import { formatCurrency } from "@/lib/utils/formatters";
import { ExpenseStats as Stats } from "@/lib/types/expense/types";

interface ExpenseStatsProps {
  stats: Stats;
  isLoading: boolean;
}

const STAT_ITEMS = [
  { key: "totalAmount", label: "Total Gastado", color: "text-danger-600" },
  { key: "thisMonthAmount", label: "Este Mes", color: "text-warning-600" },
  { key: "count", label: "Cantidad", color: "text-neutral-500" },
] as const;

export function ExpenseStats({ stats, isLoading }: ExpenseStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STAT_ITEMS.map(({ key, label, color }) => (
        <div key={key} className="bg-white rounded-xl shadow-sm p-5">
          <p className={`text-xs uppercase tracking-wide font-medium ${color}`}>{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {isLoading ? "..." : key === "count" ? stats[key] : formatCurrency(stats[key])}
          </p>
        </div>
      ))}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-xs uppercase tracking-wide font-medium text-primary-600">Mayor Categoría</p>
        <p className="text-lg font-bold text-neutral-900 mt-1 truncate">
          {isLoading ? "..." : stats.topCategory?.name || "—"}
        </p>
        <p className="text-xs text-neutral-400">
          {stats.topCategory ? formatCurrency(stats.topCategory.amount) : ""}
        </p>
      </div>
    </div>
  );
}
