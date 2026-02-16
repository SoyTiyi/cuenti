import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

class S3Service {
  private getS3Client() {
    if (process.env.environment !== "production") {
      return new S3Client({
        endpoint: process.env.MINIO_ENDPOINT,
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY!,
          secretAccessKey: process.env.MINIO_SECRET_KEY!,
        },
        forcePathStyle: true,
      });
    }
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: File, key: string): Promise<string> {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: file.type,
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

