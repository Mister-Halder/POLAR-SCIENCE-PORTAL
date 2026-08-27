import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarRange, MapPin, Users } from "lucide-react";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { expeditions, type ExpeditionRegion } from "@/features/expeditions/data";

const title = "Expeditions | India PolaRis";
const description =
  "Browse Indian Antarctic, Arctic, Southern Ocean and Himalayan expeditions with objectives, teams, field highlights and the datasets each campaign produced.";

export const Route = createFileRoute("/expeditions/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ExpeditionsIndex,
});

const regions: (ExpeditionRegion | "All")[] = [
  "All",
  "Antarctic",
  "Arctic",
  "Southern Ocean",
  "Himalaya",
];

const statusStyles: Record<string, string> = {
  ongoing: "bg-success text-success-foreground",
  planned: "bg-warning text-warning-foreground",
  completed: "bg-secondary text-secondary-foreground",
};

function ExpeditionsIndex() {
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const visible = expeditions.filter((e) => region === "All" || e.region === region);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Field programme"
        title="Expeditions and field campaigns"
        lead="Every campaign is published with its objectives, participating institutions, field highlights and links to the datasets it generated."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by region">
          {regions.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={region === r ? "default" : "outline"}
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
            >
              {r}
            </Button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted-foreground" role="status">
          Showing {visible.length} of {expeditions.length} campaigns
        </p>

        <ul className="mt-8 grid gap-6 lg:grid-cols-2">
          {visible.map((e) => (
            <li key={e.slug}>
              <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={statusStyles[e.status]}>{e.status}</Badge>
                  <Badge variant="outline">{e.code}</Badge>
                  <Badge variant="secondary">{e.region}</Badge>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">
                  <Link
                    to="/expeditions/$slug"
                    params={{ slug: e.slug }}
                    className="underline-offset-4 hover:underline"
                  >
                    {e.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {e.summary}
                </p>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="flex items-start gap-2">
                    <CalendarRange className="mt-0.5 size-4 text-accent" aria-hidden />
                    <div>
                      <dt className="text-xs text-muted-foreground">Season</dt>
                      <dd className="font-medium">{e.season}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 text-accent" aria-hidden />
                    <div>
                      <dt className="text-xs text-muted-foreground">Base</dt>
                      <dd className="font-medium">{e.basecamp}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 size-4 text-accent" aria-hidden />
                    <div>
                      <dt className="text-xs text-muted-foreground">Participants</dt>
                      <dd className="font-medium tabular-nums">{e.participants}</dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-5">
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/expeditions/$slug" params={{ slug: e.slug }}>
                      Expedition record
                    </Link>
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </PublicShell>
  );
}
