"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Expense, CreateExpenseDTO, ExpenseStats, MonthlyExpense } from "@/lib/types/expense/types";

function computeStats(expenses: Expense[]): ExpenseStats {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalAmount = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  
  const thisMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= startOfMonth
  );
  const thisMonthAmount = thisMonthExpenses.reduce(
    (acc, e) => acc + Number(e.amount), 0
  );

  // Top category
  const categoryTotals: Record<string, { name: string; amount: number }> = {};
  for (const expense of expenses) {
    const catName = expense.category.name;
    if (!categoryTotals[catName]) {
      categoryTotals[catName] = { name: catName, amount: 0 };
    }
    categoryTotals[catName].amount += Number(expense.amount);
  }
  const topCategory = Object.values(categoryTotals).sort((a, b) => b.amount - a.amount)[0] || null;

  return {
    totalAmount,
    thisMonthAmount,
    topCategory,
    count: expenses.length,
  };
}

function computeMonthlyTrend(expenses: Expense[]): MonthlyExpense[] {
  const months: Record<string, number> = {};
  const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  // Initialize last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`;
    months[key] = 0;
  }

  // Aggregate expenses
  for (const expense of expenses) {
    const d = new Date(expense.date);
    const key = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`;
    if (months.hasOwnProperty(key)) {
      months[key] += Number(expense.amount);
    }
  }

  return Object.entries(months).map(([month, amount]) => ({ month, amount }));
}

export function useExpenses(companyId: number | null) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchExpenses() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/expense/company/${companyId}`);
        if (!res.ok) throw new Error("Error al cargar los gastos");
        const data = await res.json();
        setExpenses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, [companyId]);

  const createExpense = useCallback(
    async (data: Omit<CreateExpenseDTO, "companyId">): Promise<Expense | null> => {
      if (!companyId) return null;
      try {
        const res = await fetch(`/api/expense/company/${companyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, companyId }),
        });
        if (!res.ok) throw new Error("Error al crear el gasto");
        const newExpense: Expense = await res.json();
        setExpenses((prev) => [newExpense, ...prev]);
        return newExpense;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [companyId]
  );

  const deleteExpense = useCallback(async (expenseId: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/expense/${expenseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const stats = useMemo(() => computeStats(expenses), [expenses]);
  const monthlyTrend = useMemo(() => computeMonthlyTrend(expenses), [expenses]);

  return { expenses, isLoading, error, stats, monthlyTrend, createExpense, deleteExpense };
}
