import { createFileRoute } from "@tanstack/react-router";
import { FileText, Headphones, Image as ImageIcon, Video } from "lucide-react";
import { useState } from "react";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mediaItems, mediaKinds, type MediaItem } from "@/features/media/data";

const title = "Media library | India Polar Science Portal";
const description =
  "Field photography, video, hydrophone audio and official reports from Indian Antarctic, Arctic and Himalayan expeditions, with credits and reuse licences.";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MediaPage,
});

const kindIcon = {
  photo: ImageIcon,
  video: Video,
  audio: Headphones,
  document: FileText,
} as const;

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function TileArt({ item }: { item: MediaItem }) {
  // Deterministic generated artwork stands in for the asset thumbnail until the
  // media CDN is attached, keeping SSR and hydration output identical.
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
      style={{
        backgroundImage: `linear-gradient(150deg, hsl(${item.hue} 55% 26%) 0%, hsl(${
          item.hue + 18
        } 48% 46%) 55%, hsl(${item.hue + 34} 40% 78%) 100%)`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 200 150" className="absolute inset-0 size-full opacity-45">
        <polyline points="0,118 34,96 58,110 92,74 124,98 158,66 200,92" fill="none" stroke="white" strokeWidth="2" />
        <polyline points="0,140 40,124 76,134 112,108 152,124 200,104" fill="none" stroke="white" strokeWidth="1.2" />
        <circle cx="164" cy="34" r="14" fill="white" opacity="0.55" />
      </svg>
    </div>
  );
}

function MediaPage() {
  const [kind, setKind] = useState<"all" | MediaItem["kind"]>("all");
  const [active, setActive] = useState<MediaItem | null>(null);

  const visible = mediaItems.filter((m) => kind === "all" || m.kind === kind);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Media"
        title="Field media library"
        lead="Photographs, video, acoustic recordings and official reports from the field. Everything here is credited to the scientist or crew member who captured it and released under a stated licence."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by media type">
          <Button
            size="sm"
            variant={kind === "all" ? "default" : "outline"}
            aria-pressed={kind === "all"}
            onClick={() => setKind("all")}
          >
            All ({mediaItems.length})
          </Button>
          {mediaKinds.map((k) => {
            const count = mediaItems.filter((m) => m.kind === k).length;
            const Icon = kindIcon[k];
            return (
              <Button
                key={k}
                size="sm"
                variant={kind === k ? "default" : "outline"}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
              >
                <Icon className="mr-1.5 size-4" aria-hidden />
                {k} ({count})
              </Button>
            );
          })}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => {
            const Icon = kindIcon[m.kind];
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className="group w-full rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-accent"
                >
                  <TileArt item={m} />
                  <div className="p-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="size-3.5 text-accent" aria-hidden />
                      <span className="capitalize">{m.kind}</span>
                      {m.durationSeconds ? <span>· {formatDuration(m.durationSeconds)}</span> : null}
                      {m.pages ? <span>· {m.pages} pages</span> : null}
                    </div>
                    <h2 className="mt-1.5 font-display text-base font-semibold group-hover:text-accent">
                      {m.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {m.location} · {m.captured}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{active.title}</DialogTitle>
                <DialogDescription>
                  {active.location} · captured {active.captured} · {active.expeditionCode}
                </DialogDescription>
              </DialogHeader>
              <TileArt item={active} />
              <p className="text-sm leading-relaxed">{active.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {active.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Credit</dt>
                  <dd className="font-medium">{active.credit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Licence</dt>
                  <dd className="font-medium">{active.license}</dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PublicShell>
  );
}
