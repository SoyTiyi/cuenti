import prisma from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  { name: "Insumos", description: "Productos y materiales", color: "#8B5CF6" },
  { name: "Alquiler", description: "Local o espacio de trabajo", color: "#EF4444" },
  { name: "Servicios", description: "Luz, agua, internet", color: "#F59E0B" },
  { name: "Transporte", description: "Movilidad", color: "#10B981" },
  { name: "Capacitación", description: "Cursos y formación", color: "#3B82F6" },
  { name: "Otros", description: "Gastos varios", color: "#6B7280" },
];

let seeded = false;
let seedPromise: Promise<void> | null = null;

class CategoryService {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async seedDefaultCategories(): Promise<void> {
    // Only seed once per server instance
    if (seeded) return;
    
    // If seeding is in progress, wait for it
    if (seedPromise) return seedPromise;

    seedPromise = this._doSeed();
    return seedPromise;
  }

  private async _doSeed(): Promise<void> {
    try {
      // Check if any categories exist
      const count = await prisma.category.count();
      if (count > 0) {
        seeded = true;
        return;
      }

      // Bulk create all at once (much faster than upsert loop)
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES,
        skipDuplicates: true,
      });

      seeded = true;
    } catch (error) {
      console.error("Error seeding categories:", error);
      throw error;
    } finally {
      seedPromise = null;
    }
  }
}

export const categoryService = new CategoryService();
