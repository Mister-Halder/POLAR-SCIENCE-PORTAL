import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { searchDatasets, type Dataset } from "@/features/repository/data";

/**
 * Repository search boundary.
 *
 * When MEILISEARCH_HOST is configured the query is proxied to Meilisearch with
 * a server-held search key. Otherwise the in-repo curated catalogue is filtered
 * locally so the UI stays fully functional as a demo.
 */

const querySchema = z.object({
  q: z.string().max(200).optional(),
  theme: z.string().max(60).optional(),
  region: z.string().max(60).optional(),
  access: z.enum(["all", "open", "registered", "restricted"]).optional(),
  from: z.string().max(10).optional(),
  to: z.string().max(10).optional(),
  sort: z.enum(["relevance", "recent", "downloads", "citations"]).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const searchRepository = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => querySchema.parse(input))
  .handler(async ({ data }): Promise<{ source: "meilisearch" | "local"; hits: Dataset[] }> => {
    const host = process.env["MEILISEARCH_HOST"];
    const key = process.env["MEILISEARCH_SEARCH_KEY"];

    if (host && key) {
      const filters: string[] = [];
      if (data.theme && data.theme !== "all") filters.push(`theme = "${data.theme}"`);
      if (data.region && data.region !== "all") filters.push(`region_group = "${data.region}"`);
      if (data.access && data.access !== "all") filters.push(`access = "${data.access}"`);

      const response = await fetch(`${host}/indexes/datasets/search`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          q: data.q ?? "",
          limit: data.limit ?? 20,
          filter: filters.length ? filters.join(" AND ") : undefined,
        }),
      });
      if (!response.ok) throw new Error(`Search backend error (${response.status})`);
      const payload = (await response.json()) as { hits: Dataset[] };
      return { source: "meilisearch", hits: payload.hits };
    }

    return { source: "local", hits: searchDatasets(data).slice(0, data.limit ?? 20) };
  });
