import { expenseService } from "@/service/ExpenseService";
import { apiCache } from "@/lib/cache";
import { CreateExpenseDTO } from "@/lib/types/expense/types";
import { validateActiveSession } from "@/lib/auth-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Validate active session
  const { error, status } = await validateActiveSession();

  if (error) {
    return Response.json({ message: error }, { status });
  }

  try {
    const { id } = await params;
    const cacheKey = `expenses:company:${id}`;

    // Try cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return Response.json(cached, { status: 200 });
    }

    const expenses = await expenseService.getExpensesByCompanyId(id);

    // Cache the result
    apiCache.set(cacheKey, expenses);

    return Response.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return Response.json(
      { message: "Error fetching expenses" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Validate active session
  const { error, status } = await validateActiveSession();

  if (error) {
    return Response.json({ message: error }, { status });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const data: CreateExpenseDTO = {
      ...body,
      companyId: Number(id),
    };

    const expense = await expenseService.createExpense(data);

    // Invalidate cache for this company
    apiCache.invalidate(`expenses:company:${id}`);
    // Also invalidate analytics cache
    apiCache.invalidatePattern(`analytics:balance:${id}`);

    return Response.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return Response.json(
      { message: "Error creating expense" },
      { status: 500 },
    );
  }
}
