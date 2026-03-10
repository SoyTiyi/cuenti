import prisma from "@/lib/prisma";
import { UpdateCompanyDTO } from "@/lib/types/company/types";

class CompanyService {
  async getCompanyById(id: number) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async updateCompany(id: number, data: UpdateCompanyDTO) {
    return prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        companyImage: data.companyImage,
        phone: data.phone,
        email: data.email,
        website: data.website,
        taxId: data.taxId,
        taxName: data.taxName,
        currency: data.currency,
        timezone: data.timezone,
        businessHours: data.businessHours,
        paymentMethods: data.paymentMethods,
      },
    });
  }

  async uploadCompanyImage(companyId: number, imageUrl: string) {
    return prisma.company.update({
      where: { id: companyId },
      data: { companyImage: imageUrl },
    });
  }
}

export const companyService = new CompanyService();
