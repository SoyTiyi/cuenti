import prisma from '@/lib/prisma';
import { CreateClientDTO } from '@/lib/types/client/types';

class ClientService {
  async getClientsByCompanyId(companyId: string) {
    return prisma.client.findMany({
      where: { companyId: Number(companyId) },
      include: {
        sales: {
          select: {
            id: true,
            amount: true,
            isPaid: true,
            paidAmount: true,
            saleDate: true,
            service: { select: { id: true, name: true, price: true } },
          },
          orderBy: { saleDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createClient(data: CreateClientDTO, companyId: string) {
    return prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        company: { connect: { id: Number(companyId) } },
      },
    });
  }
}

export const clientService = new ClientService();
