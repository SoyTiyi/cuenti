import { CompleteOnboardingData } from "@/lib/types/onboarding/types";
import { onboardingService } from "@/service/OnboardingService";

export async function POST(request: Request) {
    try {
        const data: CompleteOnboardingData = await request.json();

        const result = await onboardingService.completeOnboarding(data);

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error processing onboarding data:", error);
        return new Response(JSON.stringify({ message: "Error processing onboarding data" }), { status: 500 });
    }
}