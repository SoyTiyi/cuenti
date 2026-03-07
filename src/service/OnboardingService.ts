import prisma from "@/lib/prisma";
import { CompleteOnboardingData } from "@/lib/types/onboarding/types";

class OnboardingService {
    async completeOnboarding(email: string, data: CompleteOnboardingData) {
        try {
            if (!email) {
                throw new Error("User email is required");
            }

            await prisma.company.create({
                data: {
                    name: data.businessName,
                    address: data.address,
                    description: data.description,
                    companyImage: data.logoUrl,
                    owner: {
                        connect: { email }
                    },
                },
            });

            await prisma.user.update({
                where: { email },
                data: { needsOnboarding: false },
            });

            return { message: "Onboarding completed successfully" };
        } catch (error) {
            console.error("Error completing onboarding:", error);
            throw new Error("Error completing onboarding");
        }
    }
}

export const onboardingService = new OnboardingService();