import { categoryService } from "@/service/CategoryService";

export async function GET() {
  try {
    // Ensure default categories exist
    await categoryService.seedDefaultCategories();
    const categories = await categoryService.getAllCategories();
    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json({ message: "Error fetching categories" }, { status: 500 });
  }
}
