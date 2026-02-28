"use client";

import { useState, useEffect, useCallback } from "react";
import { Sale, CreateSaleDTO, SaleStats, SalesChartDay, TopService } from "@/lib/types/sale/type";

const CHART_COLORS = ["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const DAY_LABELS: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

function computeStats(sales: Sale[]): SaleStats {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlySales = sales.filter((s) => new Date(s.saleDate) >= startOfMonth);

  const totalAmount = sales.reduce((acc, s) => acc + Number(s.amount), 0);
  const collectedAmount = sales.reduce((acc, s) => acc + Number(s.paidAmount), 0);
  const pendingAmount = totalAmount - collectedAmount;
  const monthSalesCount = monthlySales.length;
  const pendingSalesCount = sales.filter((s) => !s.isPaid).length;

  return { totalAmount, collectedAmount, pendingAmount, monthSalesCount, pendingSalesCount };
}

function computeLast7Days(sales: Sale[]): SalesChartDay[] {
  const today = new Date();
  const days: SalesChartDay[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const count = sales.filter((s) => s.saleDate.split("T")[0] === dateStr).length;
    days.push({ day: DAY_LABELS[date.getDay()], sales: count });
  }

  return days;
}

function computeTopServices(sales: Sale[]): TopService[] {
  const counts: Record<string, number> = {};
  for (const sale of sales) {
    const name = sale.service.name;
    counts[name] = (counts[name] ?? 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, quantity], i) => ({
      name,
      quantity,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
}

export function useSales(companyId: number | null) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchSales() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/sale/company/${companyId}`);
        if (!res.ok) throw new Error("Error al cargar las ventas");
        const data = await res.json();
        setSales(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSales();
  }, [companyId]);

  const createSale = useCallback(
    async (data: Omit<CreateSaleDTO, "companyId">): Promise<Sale | null> => {
      if (!companyId) return null;
      try {
        const res = await fetch(`/api/sale/company/${companyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, companyId }),
        });
        if (!res.ok) throw new Error("Error al guardar la venta");
        const newSale: Sale = await res.json();
        setSales((prev) => [newSale, ...prev]);
        return newSale;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [companyId]
  );

  const markAsPaid = useCallback(async (saleId: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/sale/${saleId}/paid`, { method: "PATCH" });
      if (!res.ok) throw new Error("Error al marcar como pagado");
      setSales((prev) =>
        prev.map((s) => (s.id === saleId ? { ...s, isPaid: true, paidAmount: s.amount } : s))
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const stats = computeStats(sales);
  const last7Days = computeLast7Days(sales);
  const topServices = computeTopServices(sales);

  return { sales, isLoading, error, stats, last7Days, topServices, createSale, markAsPaid };
}
