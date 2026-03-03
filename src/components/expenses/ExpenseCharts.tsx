import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { Expense } from "@/lib/types/expense/types";
import type { MonthlyExpense } from "@/lib/types/expense/types";

interface ExpenseChartsProps {
  expenses: Expense[];
  monthlyTrend: MonthlyExpense[];
}

export function ExpenseCharts({ expenses, monthlyTrend }: ExpenseChartsProps) {
  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
  };

  // Compute category breakdown
  const categoryTotals: Record<string, { name: string; amount: number; color: string }> = {};
  for (const expense of expenses) {
    const cat = expense.category;
    if (!categoryTotals[cat.name]) {
      categoryTotals[cat.name] = { name: cat.name, amount: 0, color: cat.color || "#6366F1" };
    }
    categoryTotals[cat.name].amount += Number(expense.amount);
  }
  const categoryData = Object.values(categoryTotals).sort((a, b) => b.amount - a.amount);

  const empty = (
    <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
      Sin datos aún
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Gastos por categoría</h2>
        <div className="h-64">
          {categoryData.length === 0 ? empty : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Monto"]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Tendencia mensual</h2>
        <div className="h-64">
          {monthlyTrend.length === 0 ? empty : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Gastos"]}
                />
                <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
