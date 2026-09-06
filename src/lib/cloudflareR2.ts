import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadImageToR2(file: File) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const baseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";
    const imageUrl = `${baseUrl.replace(/\/$/, "")}/${fileName}`;

    return {
      fileId: fileName,
      imageUrl,
    };
  } catch (error) {
    console.error("Error uploading to Cloudflare R2:", error);
    throw error;
  }
}
