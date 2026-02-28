import { serviceService } from "@/service/ServiceService";
import type { UpdateServiceDTO } from "@/lib/types/service/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: UpdateServiceDTO = {
      name: body.name,
      description: body.description,
      price: body.price,
    };

    const result = await serviceService.updateService(Number(id), data);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    const message = error instanceof Error ? error.message : "Error updating service";
    return Response.json({ message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await serviceService.deleteService(Number(id));
    return Response.json({ message: "Servicio eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    const message = error instanceof Error ? error.message : "Error deleting service";
    const status = message.includes("ventas asociadas") ? 409 : 500;
    return Response.json({ message }, { status });
  }
}
