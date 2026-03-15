import { companyService } from "@/service/CompanyService";
import { UpdateCompanyDTO } from "@/lib/types/company/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await companyService.getCompanyById(Number(id));
    
    if (!company) {
      return Response.json({ message: "Company not found" }, { status: 404 });
    }
    
    return Response.json(company, { status: 200 });
  } catch (error) {
    console.error("Error fetching company:", error);
    return Response.json({ message: "Error fetching company" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: UpdateCompanyDTO = await request.json();
    
    const updated = await companyService.updateCompany(Number(id), data);
    
    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);
    return Response.json({ message: "Error updating company" }, { status: 500 });
  }
}
