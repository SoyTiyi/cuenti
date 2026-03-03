import { expenseService } from "@/service/ExpenseService";
import { CreateExpenseDTO } from "@/lib/types/expense/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenses = await expenseService.getExpensesByCompanyId(id);
    return Response.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return Response.json({ message: "Error fetching expenses" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: CreateExpenseDTO = {
      ...body,
      companyId: Number(id),
    };

    const expense = await expenseService.createExpense(data);
    return Response.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return Response.json({ message: "Error creating expense" }, { status: 500 });
  }
}
