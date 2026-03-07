import { CompleteOnboardingData } from "@/lib/types/onboarding/types";
import { onboardingService } from "@/service/OnboardingService";
import { validateActiveSession } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  // Validate active session
  const { error, status, user } = await validateActiveSession();

  if (error) {
    return Response.json({ message: error }, { status });
  }

  try {
    const email = user!.email;
    const data: CompleteOnboardingData = await request.json();

    const result = await onboardingService.completeOnboarding(email, data);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error processing onboarding data:", error);
    return new Response(
      JSON.stringify({ message: "Error processing onboarding data" }),
      { status: 500 },
    );
  }
}