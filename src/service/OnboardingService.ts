import prisma from "@/lib/prisma";
import { CompleteOnboardingData } from "@/lib/types/onboarding/types";
import { auth0 } from "@/lib/auth0";

class OnboardingService {
    async completeOnboarding(data: CompleteOnboardingData) {
        try {

            const email = await auth0.getSession().then(session => session?.user?.email);

            if (!email) {
                throw new Error("User email not found in session");
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
            return { message: "Onboarding completed successfully" };
        } catch (error) {
            console.error("Error completing onboarding:", error);
            throw new Error("Error completing onboarding");
        }
    }
}

export const onboardingService = new OnboardingService();