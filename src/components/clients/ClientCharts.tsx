import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { ClientWithStats } from "@/lib/types/client/types";
import { formatCurrency } from "@/lib/utils/formatters";

interface ClientChartsProps {
  clients: ClientWithStats[];
}

export function ClientCharts({ clients: allClients }: ClientChartsProps) {
  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
  };

  const topByVisits = [...allClients]
    .filter((c) => c.visitCount > 0)
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 5)
    .map((c) => ({ name: c.name.split(" ")[0], visitas: c.visitCount }));

  const topBySpent = [...allClients]
    .filter((c) => c.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map((c) => ({ name: c.name.split(" ")[0], total: c.totalSpent }));

  const empty = (
    <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
      Sin datos aún
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Top 5 — Más visitas</h2>
        <div className="h-56">
          {topByVisits.length === 0 ? empty : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topByVisits} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={12} width={70} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="visitas" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Top 5 — Más gastado</h2>
        <div className="h-56">
          {topBySpent.length === 0 ? empty : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBySpent} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={12}
                  tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={12} width={70} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [formatCurrency(value), "Total"]}
                />
                <Bar dataKey="total" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
