"use client";

import { useState } from "react";
import { TrendingDown, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useExpenses } from "@/hooks/useExpenses";
import { useCategories } from "@/hooks/useCategories";
import { ExpenseStats, ExpenseCharts, ExpenseList, NewExpenseModal } from "@/components/expenses";
import { formatCurrency } from "@/lib/utils/formatters";

export default function GastosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { companyId, isLoading: isCompanyLoading } = useCompany();
  const { expenses, isLoading: isExpensesLoading, stats, monthlyTrend, createExpense, deleteExpense } = useExpenses(companyId);
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const isLoading = isCompanyLoading || isExpensesLoading || isCategoriesLoading;

  const handleCreateExpense = async (data: { amount: number; description: string; date: string; categoryId: number }) => {
    await createExpense(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gastos</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {isLoading ? "Cargando..." : `Total: ${formatCurrency(stats.totalAmount)} · ${stats.count} registros`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-danger-500 text-white rounded-lg hover:bg-danger-600 font-medium transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Nuevo Gasto
        </button>
      </div>

      <ExpenseStats stats={stats} isLoading={isLoading} />

      {!isLoading && expenses.length > 0 && (
        <ExpenseCharts expenses={expenses} monthlyTrend={monthlyTrend} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          categories={categories}
          onDelete={deleteExpense}
        />
      )}

      <NewExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSubmit={handleCreateExpense}
      />
    </div>
  );
}
