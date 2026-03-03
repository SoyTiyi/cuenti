import prisma from "@/lib/prisma";

class CategoryService {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async seedDefaultCategories() {
    const defaults = [
      { name: "Insumos", description: "Productos y materiales", color: "#8B5CF6" },
      { name: "Alquiler", description: "Local o espacio de trabajo", color: "#EF4444" },
      { name: "Servicios", description: "Luz, agua, internet", color: "#F59E0B" },
      { name: "Transporte", description: "Movilidad", color: "#10B981" },
      { name: "Capacitación", description: "Cursos y formación", color: "#3B82F6" },
      { name: "Otros", description: "Gastos varios", color: "#6B7280" },
    ];

    for (const cat of defaults) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
    }
  }
}

export const categoryService = new CategoryService();
