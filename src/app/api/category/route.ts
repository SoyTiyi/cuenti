import { categoryService } from "@/service/CategoryService";

export async function GET(_request: Request) {  
    const categories = await categoryService.getAllCategories();
    return new Response(JSON.stringify(categories), { status: 200 });
}