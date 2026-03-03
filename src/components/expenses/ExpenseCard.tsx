import { TrendingDown, Calendar, Tag, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { Expense } from "@/lib/types/expense/types";

interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: number) => void;
}

export function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center">
            <TrendingDown size={18} className="text-danger-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-danger-600">{formatCurrency(Number(expense.amount))}</p>
            <p className="text-xs text-neutral-400">{formatDate(expense.date)}</p>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Tag size={14} className="text-neutral-400" />
        <span
          className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${expense.category.color}20`,
            color: expense.category.color || "#6366F1",
          }}
        >
          {expense.category.name}
        </span>
      </div>

      {expense.description && (
        <p className="text-sm text-neutral-600 line-clamp-2">{expense.description}</p>
      )}
    </div>
  );
}
