import { NextRequest, NextResponse } from "next/server";
import { s3Service } from "@/service/aws/S3Service";
import { companyService } from "@/service/CompanyService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = parseInt(id, 10);

    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: "Invalid company ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Generate unique key for the file
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const key = `company-${companyId}-${timestamp}.${fileExtension}`;

    // Upload to MinIO/S3
    const bucketName = process.env.PROFILE_BUCKET || "profile-pictures";
    const location = await s3Service.uploadFile(file, key, bucketName);

    // Update company image in database
    await companyService.uploadCompanyImage(companyId, location);

    return NextResponse.json({ url: location }, { status: 200 });
  } catch (error) {
    console.error("Error uploading company logo:", error);
    return NextResponse.json(
      { error: "Failed to upload logo" },
      { status: 500 }
    );
  }
}
