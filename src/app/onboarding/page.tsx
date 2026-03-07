import { auth0 } from "@/lib/auth0";
import { userService } from "@/service/UserService";
import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  // Validate session
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await userService.getUserByEmail(session.user.email || "");

  // Check if user is active
  if (!dbUser?.isActive) {
    redirect("/pending-activation");
  }

  return <OnboardingClient />;
}
