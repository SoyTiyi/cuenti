import prisma from '@/lib/prisma';
import { CreateServiceDTO, UpdateServiceDTO } from '@/lib/types/service/types';

class ServiceService {
    async getServicesByCompanyId(companyId: string) {
        const services = await prisma.service.findMany({
            where: { companyId: Number(companyId) },
            include: {
                sales: {
                    select: { id: true, amount: true, saleDate: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return services.map((service) => {
            const salesCount = service.sales.length;
            const totalRevenue = service.sales.reduce(
                (sum, sale) => sum + Number(sale.amount),
                0
            );
            const lastSale = [...service.sales].sort(
                (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
            )[0];

            const { sales: _sales, ...rest } = service;
            return {
                ...rest,
                salesCount,
                totalRevenue,
                lastSaleDate: lastSale?.saleDate?.toISOString() ?? null,
            };
        });
    }

    async createService(data: CreateServiceDTO) {
        return prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                company: { connect: { id: data.companyId } },
            },
        });
    }

    async updateService(id: number, data: UpdateServiceDTO) {
        return prisma.service.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
            },
        });
    }

    async deleteService(id: number) {
        const service = await prisma.service.findUnique({
            where: { id },
            include: { _count: { select: { sales: true } } },
        });

        if (!service) {
            throw new Error('Servicio no encontrado');
        }

        if (service._count.sales > 0) {
            throw new Error('No se puede eliminar un servicio con ventas asociadas');
        }

        return prisma.service.delete({ where: { id } });
    }
}

export const serviceService = new ServiceService();