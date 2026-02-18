import { clientService } from "@/service/ClientService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const result = await clientService.getClientsByCompanyId(id);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return new Response(JSON.stringify({ message: "Error fetching clients" }), { status: 500 });
    }
}