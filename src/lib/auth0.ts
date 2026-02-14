import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import { userService } from "@/service/UserService";

export const auth0 = new Auth0Client({
  async onCallback(error, context, session) {
    if (error) {
      return NextResponse.redirect(
        new URL("/auth/error", process.env.APP_BASE_URL),
      );
    }

    if (session?.user) {
      const existingUser = await userService.getUserByEmail(
        session.user.email || "",
      );

      if (!existingUser) {
        await userService.createUser({
          auth0Id: session.user.sub ?? "",
          email: session.user.email ?? "",
          name: session.user.name ?? "",
          picture: session.user.picture ?? "",
          needsOnboarding: true,
        });

        return NextResponse.redirect(
          new URL("/onboarding", process.env.APP_BASE_URL),
        );
      }

      if (existingUser.needsOnboarding) {
        return NextResponse.redirect(
          new URL("/onboarding", process.env.APP_BASE_URL),
        );
      }

      return NextResponse.redirect(
        new URL(context.returnTo || "/dashboard", process.env.APP_BASE_URL),
      );
    }

    return NextResponse.redirect(new URL("/", process.env.APP_BASE_URL));
  },
});
