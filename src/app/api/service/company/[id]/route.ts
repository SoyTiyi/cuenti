import { serviceService } from "@/service/ServiceService";
import type { CreateServiceDTO } from "@/lib/types/service/types";
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
    const result = await serviceService.getServicesByCompanyId(id);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json(
      { message: "Error fetching services" },
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

    const data: CreateServiceDTO = {
      ...body,
      companyId: Number(id),
    };

    const result = await serviceService.createService(data);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return Response.json(
      { message: "Error creating service" },
      { status: 500 },
    );
  }
}