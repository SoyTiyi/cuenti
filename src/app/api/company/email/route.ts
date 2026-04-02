import { companyService } from "@/service/CompanyService";
import { validateActiveSession } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  // Validate active session
  const { error, status } = await validateActiveSession();

  if (error) {
    return Response.json({ message: error }, { status });
  }

  try {
    const headers = request.headers;
    const email = headers.get("email");

    if (email) {
      const result = await companyService.getCompanyByUserEmail(email);

      return new Response(JSON.stringify(result), { status: 200 });
    }

    return new Response(JSON.stringify({ message: "Email is required" }));
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error getting company" }),
      { status: 500 },
    );
  }
}