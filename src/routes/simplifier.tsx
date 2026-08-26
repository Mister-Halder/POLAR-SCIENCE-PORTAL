import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, BookOpen, Layers, Share2, HelpCircle } from "lucide-react";
import { z } from "zod";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PolarScienceSimplifier } from "@/features/ai/components/polar-science-simplifier";
import { SIMPLIFIER_PRESETS } from "@/features/ai/simplifier-service";
import type { SimplifierDomain } from "@/features/ai/types";
import { getExpedition } from "@/features/expeditions/data";
import { getDataset } from "@/features/repository/data";

const simplifierSearchSchema = z.object({
  datasetId: z.string().optional(),
  expedition: z.string().optional(),
  preset: z.string().optional(),
  domain: z
    .enum([
      "antarctica",
      "arctic",
      "southern-ocean",
      "himalayas",
      "atmosphere",
      "biology",
      "glaciology",
      "geology",
      "policy",
    ])
    .optional(),
});

const title = "AI Content Generator & Science Simplifier | India Polar Science Portal";
const description =
  "Transform complex scientific research papers, expedition logs, dataset descriptions, and raw notes into clear, engaging, high-school accessible outreach articles and social posts.";

export const Route = createFileRoute("/simplifier")({
  validateSearch: (search) => simplifierSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SimplifierPage,
});

function SimplifierPage() {
  const search = Route.useSearch();

  let initialText = "";
  let initialDomain: SimplifierDomain = "arctic";
  let initialSourceTitle = "";
  let initialSourceType = "";

  if (search.preset) {
    const p = SIMPLIFIER_PRESETS.find((item) => item.id === search.preset);
    if (p) {
      initialText = p.scientificInput;
      initialDomain = p.domain;
      initialSourceTitle = p.title;
      initialSourceType = p.sourceType;
    }
  } else if (search.datasetId) {
    const ds = getDataset(search.datasetId);
    if (ds) {
      initialText = `Dataset Title: ${ds.title}\nTheme: ${ds.theme}\nRegion: ${ds.region}\nPrincipal Investigator: ${ds.pi} (${ds.institution})\nDOI: https://doi.org/${ds.doi}\n\nAbstract:\n${ds.abstract}\n\nKey Parameters & Keywords: ${ds.keywords.join(", ")}.`;
      initialDomain = ds.region.toLowerCase().includes("arctic")
        ? "arctic"
        : ds.region.toLowerCase().includes("himalaya")
        ? "himalayas"
        : ds.region.toLowerCase().includes("ocean")
        ? "southern-ocean"
        : "antarctica";
      initialSourceTitle = ds.title;
      initialSourceType = "Data Repository Record";
    }
  } else if (search.expedition) {
    const exp = getExpedition(search.expedition);
    if (exp) {
      initialText = `Expedition Campaign: ${exp.title} (${exp.code})\nRegion: ${exp.region}\nDates: ${exp.dates}\nLeader: ${exp.leader} (${exp.institution})\nVessel / Platform: ${exp.vessel}\n\nSummary & Scientific Objectives:\n${exp.summary}\n\nKey Milestones:\n${exp.highlights.map((h) => `- ${h}`).join("\n")}`;
      initialDomain =
        exp.region === "Arctic"
          ? "arctic"
          : exp.region === "Himalaya"
          ? "himalayas"
          : exp.region === "Southern Ocean"
          ? "southern-ocean"
          : "antarctica";
      initialSourceTitle = exp.title;
      initialSourceType = "Expedition Report";
    }
  }

  if (search.domain) {
    initialDomain = search.domain as SimplifierDomain;
  }

  const handleOpenAssistant = (promptTopic: string) => {
    window.dispatchEvent(
      new CustomEvent("open-polaris-ai", {
        detail: { initialPrompt: promptTopic },
      })
    );
  };

  return (
    <PublicShell>
      <PageHero
        eyebrow="AI Science Communication & Outreach"
        title="Polar Science Content Simplifier"
        lead="Transform complex scientific papers, expedition logs, and field datasets into clear, engaging, and scientifically accurate stories, bullet takeaways, and social media posts."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-accent text-accent-foreground">
            <Sparkles className="size-3 mr-1" />
            AI-Powered Outreach Generator
          </Badge>
          <span className="text-xs text-primary-foreground/80">
            For Educators · Students · Journalists · Science Communicators
          </span>
        </div>
      </PageHero>

      {/* Feature Highlights Banner */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-2xs">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <BookOpen className="size-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">Accurate & Plain-Language</p>
                <p className="text-muted-foreground mt-0.5">
                  Translates technical jargon while preserving precise numbers, dates, and locations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-2xs">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Layers className="size-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">Standardized 6-Part Output</p>
                <p className="text-muted-foreground mt-0.5">
                  Catchy Title, Simple Words, Key Takeaways, Why It Matters, Social Post & Hashtags.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-2xs">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Share2 className="size-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">Multi-Format Broadcast</p>
                <p className="text-muted-foreground mt-0.5">
                  1-Click copy for X, LinkedIn, Instagram, classrooms, newsletters, or press kits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-2xs">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">Three-Tier Fallback Engine</p>
                <p className="text-muted-foreground mt-0.5">
                  Powered by Gemini 2.5 Flash, Live Neural Engine, and built-in offline polar encyclopedia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Simplifier Workspace */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <PolarScienceSimplifier
          initialText={initialText}
          initialDomain={initialDomain}
          initialSourceTitle={initialSourceTitle}
          initialSourceType={initialSourceType}
          onOpenAssistantChat={handleOpenAssistant}
        />
      </section>
    </PublicShell>
  );
}
