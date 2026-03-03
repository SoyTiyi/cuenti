"use client";

import { useState, useEffect, useMemo } from "react";
import { MonthlyBalance, BalanceSummary } from "@/lib/types/analytics/types";

function computeSummary(data: MonthlyBalance[]): BalanceSummary {
  if (data.length < 2) {
    return {
      currentMonth: data[0] || { income: 0, expenses: 0, profit: 0, margin: 0 },
      previousMonth: { income: 0, expenses: 0, profit: 0, margin: 0 },
      trend: { profitChange: 0, marginChange: 0 },
    };
  }

  const current = data[data.length - 1];
  const previous = data[data.length - 2];

  const profitChange = previous.profit !== 0
    ? ((current.profit - previous.profit) / Math.abs(previous.profit)) * 100
    : 0;

  const marginChange = current.margin - previous.margin;

  return {
    currentMonth: current,
    previousMonth: previous,
    trend: {
      profitChange: Math.round(profitChange * 10) / 10,
      marginChange: Math.round(marginChange * 10) / 10,
    },
  };
}

export function useBalance(companyId: number | null, months: number = 6) {
  const [balance, setBalance] = useState<MonthlyBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchBalance() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/analytics/balance?companyId=${companyId}&months=${months}`);
        if (!res.ok) throw new Error("Error al cargar el balance");
        const data = await res.json();
        setBalance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [companyId, months]);

  const summary = useMemo(() => computeSummary(balance), [balance]);

  return { balance, summary, isLoading, error };
}
