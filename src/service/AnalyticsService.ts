import prisma from "@/lib/prisma";

class AnalyticsService {
  async getMonthlyBalance(companyId: string, months: number = 6) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    // Get sales grouped by month
    const sales = await prisma.sale.groupBy({
      by: ["saleDate"],
      where: {
        companyId: Number(companyId),
        saleDate: { gte: startDate },
      },
      _sum: { amount: true },
    });

    // Get expenses grouped by month
    const expenses = await prisma.expense.groupBy({
      by: ["date"],
      where: {
        companyId: Number(companyId),
        date: { gte: startDate },
      },
      _sum: { amount: true },
    });

    // Aggregate by month
    const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const result: MonthlyBalance[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`;

      const income = sales
        .filter((s) => s.saleDate.toISOString().startsWith(monthKey))
        .reduce((acc, s) => acc + Number(s._sum.amount || 0), 0);

      const expense = expenses
        .filter((e) => e.date.toISOString().startsWith(monthKey))
        .reduce((acc, e) => acc + Number(e._sum.amount || 0), 0);

      const profit = income - expense;
      const margin = income > 0 ? (profit / income) * 100 : 0;

      result.push({
        month: monthLabel,
        income,
        expenses: expense,
        profit,
        margin: Math.round(margin * 10) / 10,
      });
    }

    return result;
  }
}

export const analyticsService = new AnalyticsService();

interface MonthlyBalance {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  margin: number;
}
