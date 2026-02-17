import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

class S3Service {
  private getS3Client() {
    const region = process.env.AWS_REGION || "us-east-1";

    if (process.env.ENVIRONMENT != "production") {
      return new S3Client({
        endpoint: process.env.MINIO_ENDPOINT,
        region: region,
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY!,
          secretAccessKey: process.env.MINIO_SECRET_KEY!,
        },
        forcePathStyle: true,
      });
    }
    return new S3Client({
      region: region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: File, key: string, bucketName: string): Promise<string> {
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: "public-read" as const,
    };

    try {
      const s3Upload = new Upload({
        client: this.getS3Client(),
        params: uploadParams,
      });

      s3Upload.on("httpUploadProgress", (progress) => {
        console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
      });

      const data = await s3Upload.done();
      return data.Location ?? "";
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Error uploading file");
    }
  }
}

export const s3Service = new S3Service();

