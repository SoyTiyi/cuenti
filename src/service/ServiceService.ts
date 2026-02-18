import prisma from '@/lib/prisma';
import { CreateServiceDTO } from '@/lib/types/service/types';

class ServiceService {
    async getServicesByCompanyId(companyId: string) {
        return prisma.service.findMany({
            where: {
                company: {
                    id: Number(companyId),
                },
            },
        });
    }

    async createService(data: CreateServiceDTO) {
        return prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                company: {
                    connect: {
                        id: data.companyId,
                    },
                },
            },
        });
    }
}

export const serviceService = new ServiceService();