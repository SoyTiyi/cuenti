import { analyticsService } from "@/service/AnalyticsService";
import { apiCache } from "@/lib/cache";
import { validateActiveSession } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  // Validate active session
  const { error, status } = await validateActiveSession();

  if (error) {
    return Response.json({ message: error }, { status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const months = parseInt(searchParams.get("months") || "6", 10);

    if (!companyId) {
      return Response.json({ message: "companyId required" }, { status: 400 });
    }

    // Cache key includes companyId and months
    const cacheKey = `analytics:balance:${companyId}:${months}`;
    
    // Try to get from cache
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return Response.json(cached, { status: 200 });
    }

    // Fetch from database
    const balance = await analyticsService.getMonthlyBalance(companyId, months);
    
    // Store in cache
    apiCache.set(cacheKey, balance);
    
    return Response.json(balance, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return Response.json({ message: "Error fetching balance" }, { status: 500 });
  }
}
