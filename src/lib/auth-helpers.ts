import { auth0 } from "@/lib/auth0";
import { userService } from "@/service/UserService";

export async function validateActiveSession() {
  const session = await auth0.getSession();

  if (!session?.user?.email) {
    return { error: "Unauthorized", status: 401, user: null };
  }

  const dbUser = await userService.getUserByEmail(session.user.email);

  if (!dbUser) {
    return { error: "User not found", status: 404, user: null };
  }

  if (!dbUser.isActive) {
    return { error: "Account not activated", status: 403, user: null };
  }

  return { error: null, status: 200, user: dbUser };
}
