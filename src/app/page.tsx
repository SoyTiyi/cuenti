import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { userService } from "@/service/UserService";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await userService.getUserByEmail(session.user.email || "");

  if (!dbUser || dbUser.needsOnboarding) {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
