import prisma from "@/lib/prisma";

class CategoryService {
    async getAllCategories() {
        return prisma.category.findMany();
    }
}

export const categoryService = new CategoryService();