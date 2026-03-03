import { analyticsService } from "@/service/AnalyticsService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const months = parseInt(searchParams.get("months") || "6", 10);

    if (!companyId) {
      return Response.json({ message: "companyId required" }, { status: 400 });
    }

    const balance = await analyticsService.getMonthlyBalance(companyId, months);
    return Response.json(balance, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return Response.json({ message: "Error fetching balance" }, { status: 500 });
  }
}
