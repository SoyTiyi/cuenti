import { saleService } from "@/service/SaleService";
import { validateActiveSession } from "@/lib/auth-helpers";

export async function PATCH(
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
    const sale = await saleService.markAsPaid(Number(id));
    return Response.json(sale, { status: 200 });
  } catch (error) {
    console.error("Error marking sale as paid:", error);
    return Response.json({ message: "Error updating sale" }, { status: 500 });
  }
}
