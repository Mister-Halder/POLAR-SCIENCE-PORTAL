import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

import { PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getModule, type LearningModule } from "@/features/learning/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learning/$slug")({
  loader: ({ params }) => {
    const module = getModule(params.slug);
    if (!module) throw notFound();
    return { module };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Module not found" }, { name: "robots", content: "noindex" }] };
    }
    const { module } = loaderData;
    const t = `${module.title} | Polar learning module`;
    return {
      meta: [
        { title: t },
        { name: "description", content: module.summary.slice(0, 155) },
        { property: "og:title", content: t },
        { property: "og:description", content: module.summary.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Module not found</h1>
        <Button asChild className="mt-6">
          <Link to="/learning">All modules</Link>
        </Button>
      </div>
    </PublicShell>
  ),
  component: ModulePage,
});

function Quiz({ module }: { module: LearningModule }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = module.quiz.filter((q) => answers[q.id] === q.answerIndex).length;
  const allAnswered = module.quiz.every((q) => answers[q.id] !== undefined);

  return (
    <section className="mt-14 rounded-xl border border-border bg-card p-6" id="quiz">
      <h2 className="font-display text-2xl font-bold">Check your understanding</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {module.quiz.length} questions. Answers are marked in your browser only — nothing is stored
        or transmitted.
      </p>

      <ol className="mt-6 space-y-8">
        {module.quiz.map((q, qi) => {
          const chosen = answers[q.id];
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="font-medium">
                  {qi + 1}. {q.prompt}
                </legend>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const isChosen = chosen === oi;
                    const isCorrect = oi === q.answerIndex;
                    return (
                      <label
                        key={opt}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors",
                          !submitted && isChosen && "border-accent bg-accent/10",
                          !submitted && !isChosen && "border-border hover:bg-secondary/50",
                          submitted && isCorrect && "border-success bg-success/10",
                          submitted && isChosen && !isCorrect && "border-destructive bg-destructive/10",
                          submitted && !isChosen && !isCorrect && "border-border opacity-70",
                        )}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={isChosen}
                          disabled={submitted}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className="mt-0.5 size-4 accent-[var(--color-accent)]"
                        />
                        <span>{opt}</span>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="ml-auto size-4 shrink-0 text-success" aria-label="Correct answer" />
                        )}
                        {submitted && isChosen && !isCorrect && (
                          <XCircle className="ml-auto size-4 shrink-0 text-destructive" aria-label="Your answer, incorrect" />
                        )}
                      </label>
                    );
                  })}
                </div>
                {submitted && (
                  <p className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    {q.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {!submitted ? (
          <Button onClick={() => setSubmitted(true)} disabled={!allAnswered}>
            {allAnswered ? "Mark my answers" : "Answer all questions to continue"}
          </Button>
        ) : (
          <>
            <p className="font-display text-lg font-semibold" role="status" aria-live="polite">
              You scored {score} of {module.quiz.length}
            </p>
            <Progress value={(score / module.quiz.length) * 100} className="w-40" />
            <Button
              variant="outline"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              Try again
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

function ModulePage() {
  const { module } = Route.useLoaderData();

  return (
    <PublicShell>
      <section className="polar-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-primary-foreground/75">
            <Link to="/learning" className="underline-offset-4 hover:underline">
              Learning
            </Link>
            <span aria-hidden> / </span>
            <span>{module.level}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{module.title}</h1>
          <p className="mt-4 text-primary-foreground/85">{module.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className="bg-accent text-accent-foreground">{module.level}</Badge>
            <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground">
              {module.minutes} min read
            </Badge>
            <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground">
              {module.audience}
            </Badge>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12">
        <nav aria-label="Module contents" className="rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            In this module
          </h2>
          <ol className="mt-3 space-y-1.5 text-sm">
            {module.sections.map((s, i) => (
              <li key={s.heading}>
                <a
                  href={`#section-${i}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {i + 1}. {s.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#quiz" className="text-accent underline-offset-4 hover:underline">
                {module.sections.length + 1}. Check your understanding
              </a>
            </li>
          </ol>
        </nav>

        {module.sections.map((s, i) => (
          <section key={s.heading} id={`section-${i}`} className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold">{s.heading}</h2>
            <p className="mt-4 leading-relaxed">{s.body}</p>
            {s.takeaways?.length ? (
              <ul className="mt-5 space-y-2 rounded-xl border-l-4 border-accent bg-muted/40 p-5 text-sm">
                {s.takeaways.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <Quiz module={module} />
      </article>
    </PublicShell>
  );
}
