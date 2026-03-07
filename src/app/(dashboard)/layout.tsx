import { DashboardLayout } from "@/components/layout";
import { auth0 } from "@/lib/auth0";
import { userService } from "@/service/UserService";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate session
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await userService.getUserByEmail(session.user.email || "");

  // Validate activation status
  if (!dbUser?.isActive) {
    redirect("/pending-activation");
  }

  // Validate onboarding status
  if (dbUser.needsOnboarding) {
    redirect("/onboarding");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
