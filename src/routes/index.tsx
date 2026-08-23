import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Database, GraduationCap, Images, Ship } from "lucide-react";

import { PublicShell } from "@/components/site/public-shell";
import { PolarGlobe } from "@/components/globe/polar-globe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { expeditions } from "@/features/expeditions/data";
import { datasets } from "@/features/repository/data";
import { modules } from "@/features/learning/data";
import { headlineStats, notices, researchThemes, site } from "@/features/site/content";

const title = "India Polar Science Portal | Ministry of Earth Sciences";
const description =
  "Open expedition records, curated datasets, learning modules and media from India's Antarctic, Arctic, Southern Ocean and Himalayan research programme.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = datasets.slice(0, 3);
  const ongoing = expeditions.filter((e) => e.status !== "completed").slice(0, 2);

  return (
    <PublicShell>
      <section className="polar-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              Since {site.established} · 44 Antarctic expeditions
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-bold text-balance-tight sm:text-5xl">
              India's open window on the polar regions
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
              Expedition records, quality-controlled datasets, teaching material and field media
              from Maitri, Bharati, Himadri and HIMANSH — published by the {site.operator} under the{" "}
              {site.ministry}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/repository">
                  Search the data repository
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/expeditions">Browse expeditions</Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {headlineStats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-bold sm:text-3xl">
                      {s.value}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-primary-foreground/75">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl bg-background/95 p-4 text-foreground shadow-2xl sm:p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">
              Where India works in the polar regions
            </h2>
            <PolarGlobe />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              to: "/expeditions" as const,
              icon: Ship,
              title: "Expeditions",
              body: "Season-by-season objectives, teams, and the datasets each campaign produced.",
            },
            {
              to: "/repository" as const,
              icon: Database,
              title: "Data repository",
              body: "Faceted search across themes, regions and dates with DOI-cited downloads.",
            },
            {
              to: "/learning" as const,
              icon: GraduationCap,
              title: "Learning modules",
              body: "Structured lessons and quizzes from school level to postgraduate methods.",
            },
            {
              to: "/media" as const,
              icon: Images,
              title: "Media library",
              body: "Field photography, video, hydrophone audio and official expedition reports.",
            },
          ].map((c) => (
            <Card key={c.title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <c.icon className="size-6 text-accent" aria-hidden />
                <CardTitle className="mt-2 text-lg">{c.title}</CardTitle>
                <CardDescription>{c.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to={c.to}
                  className="inline-flex items-center text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  Open {c.title.toLowerCase()}
                  <ArrowRight className="ml-1.5 size-4" aria-hidden />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Research themes</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Six programme pillars structure India's polar science, from ice-sheet mass balance to
            Antarctic Treaty implementation.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {researchThemes.map((t) => (
              <article key={t.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-bold">Recently published datasets</h2>
              <Link
                to="/repository"
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                All datasets
              </Link>
            </div>
            <ul className="mt-6 space-y-4">
              {featured.map((d) => (
                <li key={d.id}>
                  <Link
                    to="/repository/$id"
                    params={{ id: d.id }}
                    className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{d.theme}</Badge>
                      <Badge variant="outline">{d.expeditionCode}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Published {d.published} · {d.version}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold">{d.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.abstract}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      DOI {d.doi} · PI {d.pi}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold">Notices</h2>
              <ul className="mt-4 space-y-4">
                {notices.map((n) => (
                  <li key={n.title} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{n.tag}</Badge>
                      <time dateTime={n.date}>{n.date}</time>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{n.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">In the field now</h2>
              <ul className="mt-4 space-y-3">
                {ongoing.map((e) => (
                  <li key={e.slug}>
                    <Link
                      to="/expeditions/$slug"
                      params={{ slug: e.slug }}
                      className="block rounded-lg border border-border bg-card p-4 hover:border-accent"
                    >
                      <span className="text-xs uppercase tracking-wide text-accent">
                        {e.status === "ongoing" ? "Ongoing" : "Planned"} · {e.season}
                      </span>
                      <span className="mt-1 block text-sm font-semibold">{e.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {e.basecamp}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Teach polar science with our modules</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/85">
              {modules.length} peer-reviewed modules with quizzes, from "Why India studies the poles"
              to Southern Ocean carbon accounting.
            </p>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/learning">Start learning</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}
