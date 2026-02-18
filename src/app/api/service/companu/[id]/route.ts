import { serviceService } from "@/service/ServiceService";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const result = await serviceService.getServicesByCompanyId(id);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error fetching services:", error);
        return new Response(JSON.stringify({ message: "Error fetching services" }), { status: 500 });
    }
}