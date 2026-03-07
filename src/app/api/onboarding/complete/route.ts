import { CompleteOnboardingData } from "@/lib/types/onboarding/types";
import { onboardingService } from "@/service/OnboardingService";
import { auth0 } from "@/lib/auth0";

export async function POST(request: Request) {
    try {
        const session = await auth0.getSession();
        const email = session?.user?.email;

        if (!email) {
            return new Response(
                JSON.stringify({ message: "User not authenticated" }),
                { status: 401 }
            );
        }

        const data: CompleteOnboardingData = await request.json();

        const result = await onboardingService.completeOnboarding(email, data);

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error processing onboarding data:", error);
        return new Response(JSON.stringify({ message: "Error processing onboarding data" }), { status: 500 });
    }
}