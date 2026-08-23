import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Presigned upload / download orchestration.
 *
 * The production deployment fronts an Express API (see server/ and
 * docs/ARCHITECTURE.md) that owns Postgres, Meilisearch and S3-compatible
 * object storage. These server functions are the safe boundary the browser
 * talks to: they never expose credentials, and they degrade to a clearly
 * labelled demo response when the API is not yet configured.
 *
 * Required server environment (see .env.example):
 *   POLAR_API_URL, S3_ENDPOINT, S3_BUCKET, S3_REGION,
 *   S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 */

const initUploadSchema = z.object({
  datasetTitle: z.string().min(8).max(300),
  fileName: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[\w.\-]+$/, "File names may contain letters, numbers, dot, dash and underscore only"),
  sizeBytes: z.number().int().positive().max(50 * 1024 ** 3),
  contentType: z.string().min(3).max(120),
  checksumSha256: z.string().regex(/^[a-f0-9]{64}$/, "Provide a hex SHA-256 digest"),
});

export type InitUploadInput = z.infer<typeof initUploadSchema>;

export interface PresignResult {
  mode: "presigned" | "demo";
  objectKey: string;
  uploadUrl: string | null;
  expiresInSeconds: number;
  requiredHeaders: Record<string, string>;
  note: string;
}

export const initDatasetUpload = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => initUploadSchema.parse(input))
  .handler(async ({ data }): Promise<PresignResult> => {
    const apiUrl = process.env["POLAR_API_URL"];
    const objectKey = `submissions/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}/${data.fileName}`;

    if (!apiUrl) {
      return {
        mode: "demo",
        objectKey,
        uploadUrl: null,
        expiresInSeconds: 0,
        requiredHeaders: {},
        note:
          "Object storage is not configured in this environment, so no presigned URL was minted. Set POLAR_API_URL and the S3_* variables to enable real uploads.",
      };
    }

    // Delegated to the API so that S3 credentials never enter this runtime.
    const response = await fetch(`${apiUrl}/v1/uploads/presign`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, objectKey }),
    });
    if (!response.ok) {
      throw new Error(`Presign request failed with status ${response.status}`);
    }
    return (await response.json()) as PresignResult;
  });

const downloadSchema = z.object({
  datasetId: z.string().min(3).max(64),
  fileName: z.string().min(1).max(200),
});

export const requestDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => downloadSchema.parse(input))
  .handler(async ({ data }) => {
    const apiUrl = process.env["POLAR_API_URL"];
    if (!apiUrl) {
      return {
        mode: "demo" as const,
        url: null,
        expiresInSeconds: 0,
        note: `Presigned GET for ${data.datasetId}/${data.fileName} requires POLAR_API_URL.`,
      };
    }
    const response = await fetch(
      `${apiUrl}/v1/datasets/${encodeURIComponent(data.datasetId)}/files/${encodeURIComponent(data.fileName)}/download-url`,
      { method: "POST" },
    );
    if (!response.ok) throw new Error(`Download URL request failed (${response.status})`);
    return (await response.json()) as {
      mode: "presigned";
      url: string;
      expiresInSeconds: number;
      note: string;
    };
  });
