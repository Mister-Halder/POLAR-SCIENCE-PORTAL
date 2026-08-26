import { Link, createFileRoute } from "@tanstack/react-router";
import { Clock, GraduationCap, ListChecks, Sparkles } from "lucide-react";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { modules } from "@/features/learning/data";

const title = "Learning modules | India Polar Science Portal";
const description =
  "Free polar science learning modules with quizzes — from why India studies the poles to reading ice cores and Southern Ocean carbon accounting.";

export const Route = createFileRoute("/learning/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LearningIndex,
});

const levelStyles: Record<string, string> = {
  Foundation: "bg-success text-success-foreground",
  Intermediate: "bg-accent text-accent-foreground",
  Advanced: "bg-primary text-primary-foreground",
};

function LearningIndex() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Outreach and capacity building"
        title="Learn polar science with India's research programme"
        lead="Each module is written by programme scientists, structured into short readable sections, and closed with a self-marking quiz. Free to use in classrooms with attribution."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <ul className="grid gap-6 lg:grid-cols-3">
          {modules.map((m) => (
            <li key={m.slug}>
              <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={levelStyles[m.level]}>{m.level}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    {m.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ListChecks className="size-3.5" aria-hidden />
                    {m.quiz.length} questions
                  </span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">{m.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {m.summary}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  <GraduationCap className="mr-1 inline size-3.5" aria-hidden />
                  {m.audience}
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link to="/learning/$slug" params={{ slug: m.slug }}>
                    Open module
                  </Link>
                </Button>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/40 p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">For teachers & educators</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Modules map to senior-secondary geography and environmental science syllabi. Figures and
                data referenced in each lesson resolve to a citable dataset in the repository, so
                students can work with the same measurements the scientists used. Quizzes run entirely in
                the browser and record no personal data.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-accent/40 bg-accent/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent text-accent-foreground text-xs">
                  <Sparkles className="size-3 mr-1" />
                  AI Tool
                </Badge>
                <h2 className="font-display text-xl font-bold">Polar Science Simplifier</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Have a complex research paper or expedition log you want to use in class? Use our AI Content Generator to automatically turn dense scientific reports into high-school accessible explanations, key takeaways, and social summaries.
              </p>
            </div>
            <div className="mt-4">
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/simplifier">
                  Launch Science Simplifier
                  <Sparkles className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
