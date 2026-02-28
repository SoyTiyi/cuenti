import { saleService } from "@/service/SaleService";
import { CreateSaleDTO } from "@/lib/types/sale/type";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sales = await saleService.getSalesByCompanyId(Number(id));
    return Response.json(sales, { status: 200 });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return Response.json({ message: "Error fetching sales" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: CreateSaleDTO = {
      ...body,
      companyId: Number(id),
    };

    const sale = await saleService.createSale(data);
    return Response.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return Response.json({ message: "Error creating sale" }, { status: 500 });
  }
}
