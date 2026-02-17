import "dotenv/config";
import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";

async function setupMinioBucket() {
  const s3Client = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT,
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  const bucketName = process.env.PROFILE_BUCKET || "profile-pictures";

  try {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Bucket '${bucketName}' created successfully`);
    } catch (error: any) {
      if (error.name === "BucketAlreadyOwnedByYou" || error.Code === "BucketAlreadyOwnedByYou") {
        console.log(`ℹ️  Bucket '${bucketName}' already exists`);
      } else {
        throw error;
      }
    }

    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    );

    console.log(`✅ Public read policy set for bucket '${bucketName}'`);
    console.log("✅ MinIO bucket setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up MinIO bucket:", error);
    process.exit(1);
  }
}

setupMinioBucket();
