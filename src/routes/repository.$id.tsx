import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Copy, Download, FileText, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getDataset } from "@/features/repository/data";
import { useSession } from "@/features/auth/useSession";

export const Route = createFileRoute("/repository/$id")({
  loader: ({ params }) => {
    const dataset = getDataset(params.id);
    if (!dataset) throw notFound();
    return { dataset };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Dataset not found" }, { name: "robots", content: "noindex" }] };
    }
    const { dataset } = loaderData;
    const t = `${dataset.title} | Polar data repository`;
    return {
      meta: [
        { title: t.slice(0, 70) },
        { name: "description", content: dataset.abstract.slice(0, 155) },
        { property: "og:title", content: t.slice(0, 70) },
        { property: "og:description", content: dataset.abstract.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Dataset not found</h1>
        <p className="mt-3 text-muted-foreground">
          The identifier may be retired. Search the repository for the current version.
        </p>
        <Button asChild className="mt-6">
          <Link to="/repository">Back to search</Link>
        </Button>
      </div>
    </PublicShell>
  ),
  component: DatasetDetail,
});

function DatasetDetail() {
  const { dataset: d } = Route.useLoaderData();
  const { user } = useSession();
  const [requesting, setRequesting] = useState(false);

  const citation = `${d.pi} (${d.published.slice(0, 4)}). ${d.title} (${d.version}) [Data set]. NCPOR, Ministry of Earth Sciences. https://doi.org/${d.doi}`;

  const canDownload =
    d.access === "open" || (d.access === "registered" && Boolean(user)) || user?.role === "admin";

  async function handleDownload(fileName: string) {
    // Production: POST /api/v1/datasets/:id/files/:file/download-url returns a
    // short-lived S3 presigned GET URL after RBAC + licence acceptance checks.
    toast.success("Download authorised (demo)", {
      description: `A 5-minute presigned URL would be issued for ${fileName}.`,
    });
  }

  return (
    <PublicShell>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/repository" className="underline-offset-4 hover:underline">
              Data repository
            </Link>
            <span aria-hidden> / </span>
            <span>{d.id}</span>
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">{d.theme}</Badge>
            <Badge variant="outline">{d.expeditionCode}</Badge>
            <Badge variant="outline">{d.version}</Badge>
            <Badge variant="outline">{d.license}</Badge>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-bold">{d.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            DOI{" "}
            <a
              className="text-accent underline-offset-4 hover:underline"
              href={`https://doi.org/${d.doi}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {d.doi}
            </a>{" "}
            · PI {d.pi}, {d.institution} · Published {d.published}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="cite">Citation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold">Abstract</h2>
                  <p className="mt-2 leading-relaxed">{d.abstract}</p>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Variables</h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {d.variables.map((v) => (
                      <li
                        key={v}
                        className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs"
                      >
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Keywords</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{d.keywords.join(" · ")}</p>
                </div>
              </TabsContent>

              <TabsContent value="files" className="mt-6">
                <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                  {d.files.map((f) => (
                    <li key={f.name} className="flex flex-wrap items-center gap-3 p-4">
                      <FileText className="size-5 shrink-0 text-accent" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-sm">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.format} · {f.sizeMb >= 1024 ? `${(f.sizeMb / 1024).toFixed(2)} GB` : `${f.sizeMb} MB`} ·{" "}
                          {f.checksum}
                        </p>
                      </div>
                      {canDownload ? (
                        <Button size="sm" onClick={() => handleDownload(f.name)}>
                          <Download className="mr-1.5 size-4" aria-hidden />
                          Download
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Lock className="mr-1.5 size-4" aria-hidden />
                          {d.access === "registered" ? "Sign in required" : "Request access"}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {!canDownload && (
                  <div className="mt-4 rounded-xl border border-border bg-muted/40 p-5">
                    {d.access === "registered" ? (
                      <>
                        <h3 className="font-semibold">Registered access</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Sign in with a verified portal account to download. Downloads are logged
                          against your account for reporting to the funding agency.
                        </p>
                        <Button asChild className="mt-4">
                          <Link to="/auth">Sign in</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold">Restricted dataset — submit a request</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          The principal investigator reviews each request. Decisions are usually
                          returned within ten working days.
                        </p>
                        <form
                          className="mt-4 space-y-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            setRequesting(true);
                            toast.success("Access request queued (demo)", {
                              description:
                                "In production this creates an access_requests row and notifies the PI.",
                            });
                          }}
                        >
                          <div>
                            <Label htmlFor="purpose">Intended use</Label>
                            <Textarea
                              id="purpose"
                              required
                              className="mt-1.5"
                              placeholder="Describe the analysis, the outputs you expect to publish, and any co-authors."
                            />
                          </div>
                          <Button type="submit" disabled={requesting}>
                            {requesting ? "Request submitted" : "Submit access request"}
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="metadata" className="mt-6">
                <dl className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
                  {[
                    ["Identifier", d.id],
                    ["DOI", d.doi],
                    ["Theme", d.theme],
                    ["Region", d.region],
                    ["Expedition", d.expeditionCode],
                    ["Temporal coverage", `${d.temporalStart} → ${d.temporalEnd}`],
                    [
                      "Bounding box (W,S,E,N)",
                      `${d.bbox[0]}, ${d.bbox[1]}, ${d.bbox[2]}, ${d.bbox[3]}`,
                    ],
                    ["Licence", d.license],
                    ["Access level", d.access],
                    ["Version", d.version],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                      <dd className="mt-1 text-sm font-medium break-words">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  Records are exported as ISO 19115-2 XML and DataCite 4.5 JSON for harvesting via
                  OAI-PMH.
                </p>
              </TabsContent>

              <TabsContent value="cite" className="mt-6">
                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="font-display text-lg font-bold">Cite this dataset</h2>
                  <p className="mt-3 rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                    {citation}
                  </p>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() => {
                      void navigator.clipboard.writeText(citation);
                      toast.success("Citation copied to clipboard");
                    }}
                  >
                    <Copy className="mr-1.5 size-4" aria-hidden />
                    Copy citation
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-bold">At a glance</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Downloads</dt>
                  <dd className="font-medium tabular-nums">
                    {new Intl.NumberFormat("en-IN").format(d.downloads)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Citations</dt>
                  <dd className="font-medium tabular-nums">{d.citations}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Files</dt>
                  <dd className="font-medium tabular-nums">{d.files.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total volume</dt>
                  <dd className="font-medium tabular-nums">
                    {(d.files.reduce((s, f) => s + f.sizeMb, 0) / 1024).toFixed(2)} GB
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-5 text-sm">
              <h2 className="font-semibold">Terms of use</h2>
              <p className="mt-2 text-muted-foreground">
                Released under {d.license}. Cite the DOI in any publication, and acknowledge the
                Ministry of Earth Sciences and the originating expedition.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
