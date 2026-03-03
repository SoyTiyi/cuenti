export interface MonthlyBalance {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  margin: number;
}

export interface BalanceSummary {
  currentMonth: {
    income: number;
    expenses: number;
    profit: number;
    margin: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
    profit: number;
    margin: number;
  };
  trend: {
    profitChange: number;
    marginChange: number;
  };
}
