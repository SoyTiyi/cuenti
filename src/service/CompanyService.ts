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

  async getCompanyByUserEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        companies: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user || user.companies.length === 0) {
      return null;
    }

    return user.companies[0];
  }
}

export const companyService = new CompanyService();
