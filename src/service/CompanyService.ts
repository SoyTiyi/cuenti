import prisma from '@/lib/prisma';
import { userService } from './UserService';

class CompanyService {
    async getCompanyByUserEmail(email: string) {
        const user = await userService.getUserByEmail(email);

        return prisma.company.findFirst({
            where: {
                ownerId: user?.id
            }
        });
    }
}

export const companyService = new CompanyService();