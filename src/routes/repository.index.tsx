import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, Quote, Search, SlidersHorizontal, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  accessLevels,
  datasets,
  regionFacets,
  searchDatasets,
  themes,
  type DatasetQuery,
} from "@/features/repository/data";

const title = "Data repository | India PolaRis";
const description =
  "Faceted search across curated Indian polar datasets — glaciology, atmospheric science, oceanography, biology and geophysics — with DOIs, licences and download manifests.";

export const Route = createFileRoute("/repository/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: RepositoryIndex,
});

const accessStyles: Record<string, string> = {
  open: "bg-success text-success-foreground",
  registered: "bg-warning text-warning-foreground",
  restricted: "bg-destructive text-destructive-foreground",
};

function RepositoryIndex() {
  const [query, setQuery] = useState<DatasetQuery>({ sort: "recent" });
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => searchDatasets(query), [query]);
  const set = <K extends keyof DatasetQuery>(key: K, value: DatasetQuery[K]) =>
    setQuery((q) => ({ ...q, [key]: value }));

  const totalDownloads = datasets.reduce((sum, d) => sum + d.downloads, 0);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Open data"
        title="Polar data repository"
        lead={`Search ${datasets.length} curated demonstration records drawn from Indian polar campaigns. Production search is served by Meilisearch over the full ${new Intl.NumberFormat("en-IN").format(1286)}-dataset catalogue.`}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/repository/upload">
              <Upload className="mr-2 size-4" aria-hidden />
              Submit a dataset
            </Link>
          </Button>
          <p className="self-center text-sm text-primary-foreground/80">
            {new Intl.NumberFormat("en-IN").format(totalDownloads)} downloads served from these
            records
          </p>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <form
          role="search"
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="q" className="sr-only">
                Search datasets
              </Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="q"
                  className="pl-9"
                  placeholder="Search title, abstract, DOI, variable or investigator…"
                  value={query.q ?? ""}
                  onChange={(e) => set("q", e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="facets"
            >
              <SlidersHorizontal className="mr-2 size-4" aria-hidden />
              Filters
            </Button>
            <div className="w-full sm:w-48">
              <Label htmlFor="sort" className="sr-only">
                Sort results
              </Label>
              <Select
                value={query.sort ?? "recent"}
                onValueChange={(v) => set("sort", v as DatasetQuery["sort"])}
              >
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="downloads">Most downloaded</SelectItem>
                  <SelectItem value="citations">Most cited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div id="facets" className={showFilters ? "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" : "hidden"}>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={query.theme ?? "all"} onValueChange={(v) => set("theme", v)}>
                <SelectTrigger id="theme" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All themes</SelectItem>
                  {themes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={query.region ?? "all"} onValueChange={(v) => set("region", v)}>
                <SelectTrigger id="region" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {regionFacets.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="access">Access</Label>
              <Select value={query.access ?? "all"} onValueChange={(v) => set("access", v)}>
                <SelectTrigger id="access" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any access level</SelectItem>
                  {accessLevels.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="from">Published from</Label>
              <Input
                id="from"
                type="date"
                className="mt-1.5"
                value={query.from ?? ""}
                onChange={(e) => set("from", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="to">Published to</Label>
              <Input
                id="to"
                type="date"
                className="mt-1.5"
                value={query.to ?? ""}
                onChange={(e) => set("to", e.target.value)}
              />
            </div>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {results.length} {results.length === 1 ? "dataset" : "datasets"} match your query
          </p>
          {(query.q || query.theme || query.region || query.access || query.from || query.to) && (
            <Button variant="ghost" size="sm" onClick={() => setQuery({ sort: "recent" })}>
              Clear all filters
            </Button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
            <h2 className="font-display text-lg font-semibold">No datasets matched</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a broader theme, widen the publication date range, or search a variable name such
              as "salinity" or "delta_18O".
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {results.map((d) => (
              <li key={d.id}>
                <article className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-accent">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={accessStyles[d.access]}>{d.access}</Badge>
                    <Badge variant="secondary">{d.theme}</Badge>
                    <Badge variant="outline">{d.expeditionCode}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {d.version} · published {d.published}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-lg font-semibold">
                    <Link
                      to="/repository/$id"
                      params={{ id: d.id }}
                      className="underline-offset-4 hover:underline"
                    >
                      {d.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {d.abstract.slice(0, 220)}…
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {d.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span>{d.region}</span>
                    <span>PI {d.pi}</span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="size-3.5" aria-hidden />
                      {new Intl.NumberFormat("en-IN").format(d.downloads)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Quote className="size-3.5" aria-hidden />
                      {d.citations} citations
                    </span>
                    <span>{d.license}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PublicShell>
  );
}
