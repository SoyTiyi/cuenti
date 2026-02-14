import prisma from "../lib/prisma";
import { CreateUserDTO, UserOnboardingDTO } from "../lib/types/user/types";

class UserService {

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async createUser(data: CreateUserDTO) {
        return prisma.user.create({
            data: {
                name: data.name,
                lastname: '',
                email: data.email,
                profileImage: data.picture,
                auth0Id: data.auth0Id,
                needsOnboarding: true,
            },
        });
    }

    async updateUserByOnboarding(data: UserOnboardingDTO, email: string) {
        return prisma.user.update({
            where: { email: email },
            data: {
                name: data.name,
                lastname: data.lastname,
                profileImage: data.profileImage,
                needsOnboarding: false,
            },
        });
    }
}

export const userService = new UserService();