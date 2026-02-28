import { formatCurrency } from "@/lib/utils/formatters";
import type { ServiceWithStats } from "@/lib/types/service/types";

interface ServiceStatsProps {
  services: ServiceWithStats[];
  isLoading: boolean;
}

export function ServiceStats({ services, isLoading }: ServiceStatsProps) {
  const totalServices = services.length;

  const mostSold = services.reduce<ServiceWithStats | null>(
    (best, s) => (!best || s.salesCount > best.salesCount ? s : best),
    null
  );

  const avgPrice =
    services.length > 0
      ? services.reduce((sum, s) => sum + Number(s.price), 0) / services.length
      : 0;

  const totalRevenue = services.reduce((sum, s) => sum + s.totalRevenue, 0);

  const stats = [
    { label: "Total Servicios", value: String(totalServices), color: "text-neutral-500" },
    { label: "Más vendido", value: mostSold?.name ?? "—", color: "text-primary-600" },
    { label: "Precio promedio", value: formatCurrency(avgPrice), color: "text-neutral-500" },
    { label: "Ingresos totales", value: formatCurrency(totalRevenue), color: "text-success-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-xl shadow-sm p-5">
          <p className={`text-xs uppercase tracking-wide font-medium ${color}`}>{label}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1 truncate">
            {isLoading ? "..." : value}
          </p>
        </div>
      ))}
    </div>
  );
}
