import { saleService } from "@/service/SaleService";
import { apiCache } from "@/lib/cache";
import { CreateSaleDTO } from "@/lib/types/sale/type";
import { validateActiveSession } from "@/lib/auth-helpers";

// Cache TTL for sales: 30 seconds (shorter because sales change frequently)
const SALES_CACHE_TTL = 30 * 1000;

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
    const cacheKey = `sales:company:${id}`;

    // Try cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return Response.json(cached, { status: 200 });
    }

    // Fetch from database
    const sales = await saleService.getSalesByCompanyId(Number(id));

    // Cache the result
    apiCache.set(cacheKey, sales);

    return Response.json(sales, { status: 200 });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return Response.json({ message: "Error fetching sales" }, { status: 500 });
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

    const data: CreateSaleDTO = {
      ...body,
      companyId: Number(id),
    };

    const sale = await saleService.createSale(data);

    // Invalidate sales cache for this company
    apiCache.invalidate(`sales:company:${id}`);
    // Also invalidate analytics cache
    apiCache.invalidatePattern(`analytics:balance:${id}`);

    return Response.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return Response.json({ message: "Error creating sale" }, { status: 500 });
  }
}
