import { clientService } from "@/service/ClientService";
import { CreateClientDTO } from "@/lib/types/client/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const result = await clientService.getClientsByCompanyId(id);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return new Response(JSON.stringify({ message: "Error fetching clients" }), { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const { id } = await params;

        const data: CreateClientDTO = await request.json();


        const result = await clientService.createClient(data, id);

        return new Response(JSON.stringify(result), { status: 201 });
    } catch (error) {
        console.error("Error creating client:", error);
        return new Response(JSON.stringify({ message: "Error creating client" }), { status: 500 });
    }
}   
