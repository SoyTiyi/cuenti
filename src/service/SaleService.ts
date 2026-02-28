import prisma from "@/lib/prisma";
import { CreateSaleDTO } from "@/lib/types/sale/type";

class SaleService {
  async getSalesByCompanyId(companyId: number) {
    return prisma.sale.findMany({
      where: { companyId },
      include: {
        client: {
          select: { id: true, name: true, email: true, phone: true },
        },
        service: {
          select: { id: true, name: true, price: true },
        },
      },
      orderBy: { saleDate: "desc" },
    });
  }

  async createSale(data: CreateSaleDTO) {
    const isPaid = data.isPaid ?? false;
    return prisma.sale.create({
      data: {
        amount: data.amount,
        isPaid,
        paidAmount: isPaid ? data.amount : 0,
        paymentDate: isPaid ? (data.paymentDate ? new Date(data.paymentDate) : new Date()) : null,
        saleDate: new Date(data.saleDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes ?? null,
        company: { connect: { id: data.companyId } },
        client: { connect: { id: data.clientId } },
        service: { connect: { id: data.serviceId } },
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, phone: true },
        },
        service: {
          select: { id: true, name: true, price: true },
        },
      },
    });
  }

  async markAsPaid(saleId: number) {
    return prisma.sale.update({
      where: { id: saleId },
      data: {
        isPaid: true,
        paidAmount: await prisma.sale
          .findUnique({ where: { id: saleId }, select: { amount: true } })
          .then((s) => s?.amount ?? 0),
        paymentDate: new Date(),
      },
    });
  }
}

export const saleService = new SaleService();
