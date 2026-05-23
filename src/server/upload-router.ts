import { z } from "zod";
import { createRouter, adminQuery, publicQuery } from "./middleware";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 client — uses environment variables if available
const s3Client = (() => {
  const region = process.env.S3_REGION || process.env.AWS_REGION;
  const accessKey = process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKey || !secretKey) return null;
  return new S3Client({
    region,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
})();

const BUCKET = process.env.S3_BUCKET_NAME || process.env.AWS_BUCKET || "";

export const uploadRouter = createRouter({
  /* ── Get pre-signed URL for video upload (admin) ── */
  videoUrl: adminQuery
    .input(z.object({
      filename: z.string().min(1),
      contentType: z.string().optional().default("video/mp4"),
    }))
    .mutation(async ({ input }) => {
      if (!s3Client || !BUCKET) {
        // Return a mock URL if S3 not configured — admin pastes URL manually
        return { uploadUrl: "", fileUrl: "" };
      }
      const key = `videos/${Date.now()}-${input.filename}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: input.contentType,
      });
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      const fileUrl = `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
      return { uploadUrl, fileUrl };
    }),

  /* ── Get pre-signed URL for subtitle upload (admin) ── */
  subtitleUrl: adminQuery
    .input(z.object({
      filename: z.string().min(1),
      contentType: z.string().optional().default("text/vtt"),
    }))
    .mutation(async ({ input }) => {
      if (!s3Client || !BUCKET) return { uploadUrl: "", fileUrl: "" };
      const key = `subtitles/${Date.now()}-${input.filename}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: input.contentType,
      });
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      const fileUrl = `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
      return { uploadUrl, fileUrl };
    }),

  /* ── Check if S3 is configured ── */
  status: publicQuery.query(() => {
    return { configured: !!s3Client && !!BUCKET, bucket: BUCKET || null };
  }),
});
