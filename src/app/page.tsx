import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { userService } from "@/service/UserService";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await userService.getUserByEmail(session.user.email || "");

  // Check activation status first
  if (!dbUser?.isActive) {
    redirect("/pending-activation");
  }

  // Then check onboarding
  if (dbUser.needsOnboarding) {
    redirect("/onboarding");
  }

  // Finally redirect to dashboard
  redirect("/dashboard");
}
