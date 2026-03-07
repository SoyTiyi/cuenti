import prisma from "@/lib/prisma";

class CategoryService {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }
}

export const categoryService = new CategoryService();
