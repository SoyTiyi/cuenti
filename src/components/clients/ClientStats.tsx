import type { ClientWithStats } from "@/lib/types/client/types";

interface ClientStatsProps {
  clients: ClientWithStats[];
  isLoading: boolean;
}

export function ClientStats({ clients, isLoading }: ClientStatsProps) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalClients = clients.length;
  const activeThisMonth = clients.filter((c) =>
    c.lastVisit && new Date(c.lastVisit) >= startOfMonth
  ).length;
  const newThisMonth = clients.filter(
    (c) => new Date(c.createdAt) >= startOfMonth
  ).length;
  const withDebt = clients.filter((c) => c.pendingAmount > 0).length;

  const stats = [
    { label: "Total Clientes", value: totalClients, color: "text-neutral-500" },
    { label: "Activas este mes", value: activeThisMonth, color: "text-success-600" },
    { label: "Nuevas este mes", value: newThisMonth, color: "text-primary-600" },
    { label: "Con deuda", value: withDebt, color: "text-warning-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-xl shadow-sm p-4 md:p-5">
          <p className={`text-[10px] md:text-xs uppercase tracking-wide font-medium ${color}`}>{label}</p>
          <p className="text-xl md:text-3xl font-bold text-neutral-900 mt-1">
            {isLoading ? "..." : value}
          </p>
        </div>
      ))}
    </div>
  );
}
