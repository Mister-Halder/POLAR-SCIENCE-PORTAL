import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CloudUpload, FileWarning, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { accessLevels, themes } from "@/features/repository/data";
import { expeditions } from "@/features/expeditions/data";
import { useSession } from "@/features/auth/useSession";

const title = "Submit a dataset | India Polar Science Portal";
const description =
  "Register metadata and upload data files for an Indian polar expedition dataset, with checksum verification, licence selection and curator review.";

export const Route = createFileRoute("/repository/upload")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: UploadPage,
});

type Stage = "idle" | "validating" | "presigning" | "uploading" | "queued";

const steps = [
  { id: 1, label: "Describe the dataset", detail: "Title, abstract, theme, expedition and coverage" },
  { id: 2, label: "Attach files", detail: "Checksums computed in the browser before upload" },
  { id: 3, label: "Licence and access", detail: "Choose a licence and access level, accept the policy" },
  { id: 4, label: "Curator review", detail: "Data centre validates metadata, then mints a DOI" },
];

function UploadPage() {
  const { user } = useSession();
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileName) {
      toast.error("Attach at least one data file before submitting.");
      return;
    }
    setStage("validating");
    await new Promise((r) => setTimeout(r, 500));
    setStage("presigning");
    await new Promise((r) => setTimeout(r, 600));
    setStage("uploading");
    for (let p = 0; p <= 100; p += 10) {
      setProgress(p);
      await new Promise((r) => setTimeout(r, 90));
    }
    setStage("queued");
    toast.success("Submission queued for curator review (demo)", {
      description:
        "With object storage configured, the file would stream directly to S3 via a presigned PUT.",
    });
  }

  return (
    <PublicShell>
      <PageHero
        eyebrow="Deposit"
        title="Submit a dataset"
        lead="Every funded polar project deposits its data here. Metadata is registered first, files stream directly to object storage using short-lived presigned URLs, and a curator reviews before a DOI is minted."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        {!user && (
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-warning/40 bg-warning/10 p-5">
            <FileWarning className="size-5 text-warning" aria-hidden />
            <p className="flex-1 text-sm">
              You are not signed in. The form below runs in demonstration mode; a real submission
              requires a verified researcher account.
            </p>
            <Button asChild size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        )}

        <ol className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.id} className="rounded-xl border border-border bg-card p-4">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {s.id}
              </span>
              <h2 className="mt-2 text-sm font-semibold">{s.label}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>

        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={onSubmit} className="space-y-6 lg:col-span-2">
            <fieldset className="space-y-4 rounded-xl border border-border bg-card p-6">
              <legend className="px-1 font-display text-lg font-semibold">Description</legend>
              <div>
                <Label htmlFor="title">Dataset title</Label>
                <Input
                  id="title"
                  required
                  minLength={8}
                  className="mt-1.5"
                  placeholder="e.g. Bharati station snow-pit density and stratigraphy, 2025-26"
                />
              </div>
              <div>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  required
                  rows={5}
                  className="mt-1.5"
                  placeholder="What was measured, where, with which instruments, and how the data were quality controlled."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue={themes[0]!}>
                    <SelectTrigger id="theme" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expedition">Expedition</Label>
                  <Select defaultValue={expeditions[0]!.code}>
                    <SelectTrigger id="expedition" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expeditions.map((e) => (
                        <SelectItem key={e.code} value={e.code}>
                          {e.code} — {e.season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start">Coverage start</Label>
                  <Input id="start" type="date" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="end">Coverage end</Label>
                  <Input id="end" type="date" required className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="bbox">Bounding box (west, south, east, north)</Label>
                <Input id="bbox" className="mt-1.5" placeholder="76.10, -69.45, 76.30, -69.35" />
              </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-xl border border-border bg-card p-6">
              <legend className="px-1 font-display text-lg font-semibold">Files</legend>
              <div>
                <Label htmlFor="file">Data file</Label>
                <Input
                  id="file"
                  type="file"
                  className="mt-1.5"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Accepted: NetCDF-4, CSV, TSV, GeoTIFF, GeoJSON, ZIP, PDF. Maximum 50 GB per file
                  via multipart presigned upload.
                </p>
              </div>
              {fileName && (
                <p className="rounded-md bg-muted p-3 font-mono text-xs">
                  {fileName} — SHA-256 computed client-side and verified server-side after upload.
                </p>
              )}
            </fieldset>

            <fieldset className="space-y-4 rounded-xl border border-border bg-card p-6">
              <legend className="px-1 font-display text-lg font-semibold">Licence and access</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="licence">Licence</Label>
                  <Select defaultValue="CC BY 4.0">
                    <SelectTrigger id="licence" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["CC BY 4.0", "CC BY-NC 4.0", "CC0 1.0", "Government Open Data Licence — India"].map(
                        (l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="access">Access level</Label>
                  <Select defaultValue="open">
                    <SelectTrigger id="access" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" required className="mt-1 size-4 accent-[var(--color-accent)]" />
                <span>
                  I confirm the data policy applies, that any embargo is within 24 months of the end
                  of the field season, and that personal or location-sensitive information has been
                  removed.
                </span>
              </label>
            </fieldset>

            {stage !== "idle" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {stage === "queued" ? (
                    <CheckCircle2 className="size-5 text-success" aria-hidden />
                  ) : (
                    <Loader2 className="size-5 animate-spin text-accent" aria-hidden />
                  )}
                  {stage === "validating" && "Validating metadata against the submission schema…"}
                  {stage === "presigning" && "Requesting a short-lived presigned upload URL…"}
                  {stage === "uploading" && "Streaming file to object storage…"}
                  {stage === "queued" && "Submission queued for curator review"}
                </div>
                <Progress value={stage === "queued" ? 100 : progress} className="mt-4" />
                <p className="mt-3 text-xs text-muted-foreground" role="status" aria-live="polite">
                  Demonstration flow. With POLAR_API_URL and S3 credentials configured, the browser
                  PUTs directly to object storage and never sees a long-lived key.
                </p>
              </div>
            )}

            <Button type="submit" size="lg" disabled={stage !== "idle" && stage !== "queued"}>
              <CloudUpload className="mr-2 size-4" aria-hidden />
              {stage === "queued" ? "Submit another dataset" : "Submit for review"}
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShieldCheck className="size-5 text-accent" aria-hidden />
                How the upload is secured
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>JWT access token, 15-minute lifetime, rotated refresh cookie.</li>
                <li>Role check: only researcher, curator and admin may create submissions.</li>
                <li>Presigned PUT scoped to one object key, one method, five minutes.</li>
                <li>Server recomputes SHA-256 and rejects mismatched objects.</li>
                <li>Every action written to an append-only audit log.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-5 text-sm">
              <h2 className="font-semibold">Need help?</h2>
              <p className="mt-2 text-muted-foreground">
                The NCPOR data centre reviews submissions within ten working days.{" "}
                <Link to="/contact" className="text-accent underline-offset-4 hover:underline">
                  Contact the data centre
                </Link>{" "}
                for format advice before you deposit.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold">Review states</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["draft", "submitted", "in review", "changes requested", "published"].map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
