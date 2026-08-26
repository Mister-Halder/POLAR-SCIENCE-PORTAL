import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getExpedition } from "@/features/expeditions/data";
import { getDataset } from "@/features/repository/data";

export const Route = createFileRoute("/expeditions/$slug")({
  loader: ({ params }) => {
    const expedition = getExpedition(params.slug);
    if (!expedition) throw notFound();
    return { expedition };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Expedition not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { expedition } = loaderData;
    const t = `${expedition.title} | India Polar Science Portal`;
    return {
      meta: [
        { title: t },
        { name: "description", content: expedition.summary.slice(0, 155) },
        { property: "og:title", content: t },
        { property: "og:description", content: expedition.summary.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Expedition record not found</h1>
        <p className="mt-3 text-muted-foreground">
          This campaign may have been re-coded. Browse the full expedition list instead.
        </p>
        <Button asChild className="mt-6">
          <Link to="/expeditions">All expeditions</Link>
        </Button>
      </div>
    </PublicShell>
  ),
  component: ExpeditionDetail,
});

function ExpeditionDetail() {
  const { expedition: e } = Route.useLoaderData();
  const linked = e.datasetIds.map(getDataset).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <PublicShell>
      <section className="polar-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-primary-foreground/75">
            <Link to="/expeditions" className="underline-offset-4 hover:underline">
              Expeditions
            </Link>
            <span aria-hidden> / </span>
            <span>{e.code}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-accent text-accent-foreground">{e.status}</Badge>
              <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground">
                {e.region}
              </Badge>
              <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground">
                Season {e.season}
              </Badge>
            </div>
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 shadow-sm">
              <Link to="/simplifier" search={{ expedition: e.slug }}>
                <Sparkles className="size-3.5" />
                <span>Generate Outreach Summary</span>
              </Link>
            </Button>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-bold sm:text-4xl">{e.title}</h1>
          <p className="mt-4 max-w-3xl text-primary-foreground/85">{e.summary}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <dl className="grid gap-6 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Dates", value: `${e.startDate} → ${e.endDate}` },
            { label: "Platform", value: e.vessel },
            { label: "Base of operations", value: e.basecamp },
            { label: "Participants", value: String(e.participants) },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold">Objectives</h2>
              <ul className="mt-4 space-y-3">
                {e.objectives.map((o) => (
                  <li key={o} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Field highlights</h2>
              <ul className="mt-4 space-y-3">
                {e.highlights.map((h) => (
                  <li key={h} className="rounded-lg border border-border bg-card p-4 text-sm">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Datasets from this campaign</h2>
              {linked.length ? (
                <ul className="mt-4 space-y-3">
                  {linked.map((d) => (
                    <li key={d.id}>
                      <Link
                        to="/repository/$id"
                        params={{ id: d.id }}
                        className="block rounded-lg border border-border bg-card p-4 hover:border-accent"
                      >
                        <span className="block text-sm font-semibold">{d.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {d.theme} · {d.access} access · DOI {d.doi}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Data submission for this campaign is in progress. Metadata records appear here as
                  soon as they are registered.
                </p>
              )}
            </div>
          </div>

          <aside>
            <h2 className="font-display text-xl font-bold">Science team</h2>
            <ul className="mt-4 space-y-3">
              {e.team.map((m) => (
                <li key={m.name} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-accent">{m.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.institution}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <p className="font-medium">Cite this expedition record</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                NCPOR ({new Date(e.endDate).getFullYear()}). {e.title} ({e.code}). India Polar
                Science Portal, Ministry of Earth Sciences.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
