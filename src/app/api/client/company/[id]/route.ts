import { clientService } from "@/service/ClientService";
import { CreateClientDTO } from "@/lib/types/client/types";
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
    const result = await clientService.getClientsByCompanyId(id);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return Response.json(
      { message: "Error fetching clients" },
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
    const data: CreateClientDTO = await request.json();
    const result = await clientService.createClient(data, id);
    return Response.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating client:", error);
    const isUniqueConstraint =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";
    const message = isUniqueConstraint
      ? "Ya existe un cliente con ese correo electrónico"
      : "Error creating client";
    return Response.json(
      { message },
      { status: isUniqueConstraint ? 409 : 500 },
    );
  }
}
