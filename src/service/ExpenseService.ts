import prisma from "@/lib/prisma";
import { CreateExpenseDTO } from "@/lib/types/expense/types";

class ExpenseService {
  async getExpensesByCompanyId(companyId: string) {
    return prisma.expense.findMany({
      where: { companyId: Number(companyId) },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async createExpense(data: CreateExpenseDTO) {
    return prisma.expense.create({
      data: {
        amount: data.amount,
        description: data.description,
        date: new Date(data.date),
        category: { connect: { id: data.categoryId } },
        company: { connect: { id: data.companyId } },
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });
  }

  async deleteExpense(expenseId: number) {
    return prisma.expense.delete({
      where: { id: expenseId },
    });
  }
}

export const expenseService = new ExpenseService();
