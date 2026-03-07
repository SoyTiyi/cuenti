import { NextRequest, NextResponse } from "next/server";
import { s3Service } from "@/service/aws/S3Service";
import { validateActiveSession } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  // Validate active session
  const { error, status } = await validateActiveSession();

  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const key = formData.get("key") as string;
    const bucketName = formData.get("bucketName") as string;

    if (!file || !key || !bucketName) {
      return NextResponse.json(
        { error: "Missing required fields: file, key, or bucketName" },
        { status: 400 },
      );
    }

    const location = await s3Service.uploadFile(file, key, bucketName);

    return NextResponse.json({ location }, { status: 200 });
  } catch (error) {
    console.error("Error in upload API:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
