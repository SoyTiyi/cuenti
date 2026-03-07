import { categoryService } from "@/service/CategoryService";
import { Category } from "@/lib/types/expense/types";

// Simple in-memory cache
let cachedCategories: Category[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedCategories && now - cacheTime < CACHE_TTL) {
      return Response.json(cachedCategories, { status: 200 });
    }

    // Fetch and cache
    const categories = await categoryService.getAllCategories();
    cachedCategories = categories;
    cacheTime = now;

    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json({ message: "Error fetching categories" }, { status: 500 });
  }
}

// Optional: manual cache invalidation endpoint
export async function POST() {
  cachedCategories = null;
  cacheTime = 0;
  return Response.json({ message: "Cache cleared" }, { status: 200 });
}
