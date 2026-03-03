"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, DollarSign, Wallet, PiggyBank, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";
import type { MonthlyBalance, BalanceSummary } from "@/lib/types/analytics/types";

interface BalanceChartProps {
  balance: MonthlyBalance[];
  summary: BalanceSummary;
  isLoading: boolean;
}

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="text-success-600 flex items-center gap-1 text-sm"><TrendingUp size={14} /> +{value}%</span>;
  if (value < 0) return <span className="text-danger-600 flex items-center gap-1 text-sm"><TrendingDown size={14} /> {value}%</span>;
  return <span className="text-neutral-400 flex items-center gap-1 text-sm"><Minus size={14} /> 0%</span>;
}

const SUMMARY_ITEMS = [
  { key: "income", label: "Ingresos", icon: DollarSign, color: "bg-success-100 text-success-700", barColor: "#10B981" },
  { key: "expenses", label: "Gastos", icon: Wallet, color: "bg-danger-100 text-danger-700", barColor: "#EF4444" },
  { key: "profit", label: "Ganancia", icon: PiggyBank, color: "bg-primary-100 text-primary-700", barColor: "#6366F1" },
  { key: "margin", label: "Margen", icon: Percent, color: "bg-warning-100 text-warning-700", barColor: "#F59E0B", isPercent: true },
] as const;

export function BalanceChart({ balance, summary, isLoading }: BalanceChartProps) {
  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
  };

  const current = summary.currentMonth;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {SUMMARY_ITEMS.map(({ key, label, icon: Icon, color, isPercent }) => (
          <div key={key} className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${color}`}>
                <Icon size={14} />
              </div>
              <p className="text-[10px] md:text-xs uppercase tracking-wide font-medium text-neutral-500">{label}</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-neutral-900 truncate">
              {isLoading ? "..." : isPercent ? `${current[key as keyof typeof current]}%` : formatCurrency(current[key as keyof typeof current] as number)}
            </p>
            {key === "profit" && !isLoading && (
              <div className="mt-1">
                <TrendIndicator value={summary.trend.profitChange} />
              </div>
            )}
            {key === "margin" && !isLoading && (
              <div className="mt-1">
                <TrendIndicator value={summary.trend.marginChange} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-neutral-800 mb-4">Ingresos vs Gastos</h2>
        <div className="h-64 md:h-72">
          {balance.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
              Sin datos suficientes
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={balance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => {
                    if (name === "profit") return [formatCurrency(value), "Ganancia"];
                    if (name === "margin") return [`${value}%`, "Margen"];
                    return [formatCurrency(value), name === "income" ? "Ingresos" : "Gastos"];
                  }}
                />
                <Bar dataKey="income" name="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="profit" name="profit" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-success-500" />
            <span className="text-neutral-600">Ingresos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-danger-500" />
            <span className="text-neutral-600">Gastos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-neutral-600">Ganancia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
