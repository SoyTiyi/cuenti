import prisma from '@/lib/prisma';
import { CreateClientDTO } from '@/lib/types/client/types';

class ClientService {
    async createClient(data: CreateClientDTO, companyId: string) {
        prisma.client.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                company: {
                    connect: {
                        id: Number(companyId),
                    },
                },
            },
        });
    }

    async getClientsByCompanyId(companyId: string) {
        return prisma.client.findMany({
            where: {
                company: {
                    id: Number(companyId),
                },
            },
        });
    }
}

export const clientService = new ClientService();