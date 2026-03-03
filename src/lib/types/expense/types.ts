export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
    color: string | null;
  };
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDTO {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  companyId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
}

export interface ExpenseStats {
  totalAmount: number;
  thisMonthAmount: number;
  topCategory: { name: string; amount: number } | null;
  count: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}
