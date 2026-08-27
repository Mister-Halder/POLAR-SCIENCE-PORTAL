import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PublicShell } from "@/components/site/public-shell";
import { Button } from "@/components/ui/button";
import { ShieldQuestion } from "lucide-react";
import { researchPapers } from "@/features/site/content";
import { useSession } from "@/features/auth/useSession";

const title = "Research Library | India Polar Science Portal";
const description =
  "Explore scientific literature related to polar science, cryosphere research, oceanography, atmospheric science, and other research areas connected to Polaris.";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ResearchLibraryPage,
});

function ResearchLibraryPage() {
  const { user, ready } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");

  const regions = useMemo(() => {
    return ["All", ...Array.from(new Set(researchPapers.map((paper) => paper.region)))];
  }, []);

  const themes = [
    "All",
    "Cryosphere & ice-sheet dynamics",
    "Polar atmosphere & aerosols",
    "Southern Ocean & fjord systems",
    "Polar biology & ecosystems",
    "Geology & solid-earth geophysics",
    "Policy, law & capacity building",
  ];

  const filteredPapers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = researchPapers.filter((paper) => {
      const searchableText = [
        paper.title,
        paper.abstract,
        paper.journal,
        paper.region,
        paper.theme,
        ...paper.authors,
        ...paper.keywords,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || searchableText.includes(query);
      const matchesRegion = selectedRegion === "All" || paper.region === selectedRegion;
      const matchesTheme = selectedTheme === "All" || paper.theme === selectedTheme;

      return matchesSearch && matchesRegion && matchesTheme;
    });

    const sorted = [...filtered];
    switch (selectedSort) {
      case "oldest":
        sorted.sort((a, b) => a.year - b.year);
        break;
      case "newest":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "region":
        sorted.sort((a, b) => a.region.localeCompare(b.region));
        break;
      case "theme":
        sorted.sort((a, b) => a.theme.localeCompare(b.theme));
        break;
      default:
        break;
    }

    return sorted;
  }, [searchQuery, selectedRegion, selectedTheme, selectedSort]);

  if (!ready) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-5xl px-4 py-24">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </PublicShell>
    );
  }

  if (!user) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <ShieldQuestion className="mx-auto size-10 text-accent" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold">
            Sign in to view the Research Library
          </h1>
          <p className="mt-3 text-muted-foreground">
            The Research Library contains scientific literature curated by NCPOR researchers. Please
            sign in to access it.
          </p>
          <Button asChild className="mt-6">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Polaris Research
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Research Paper Library
              </h1>

              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Explore scientific literature related to polar science, cryosphere research,
                oceanography, atmospheric science, and other research areas connected to Polaris.
              </p>
            </div>
          </div>
        </section>

        {/* Search and filters */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-[1fr_200px_200px_200px]">
              {/* Search */}
              <div>
                <label
                  htmlFor="research-search"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Search papers
                </label>

                <input
                  id="research-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search title, author, keyword..."
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Region */}
              <div>
                <label
                  htmlFor="research-region"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Region
                </label>

                <select
                  id="research-region"
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme */}
              <div>
                <label
                  htmlFor="research-theme"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Research theme
                </label>

                <select
                  id="research-theme"
                  value={selectedTheme}
                  onChange={(event) => setSelectedTheme(event.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
                >
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label
                  htmlFor="research-sort"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Sort by
                </label>

                <select
                  id="research-sort"
                  value={selectedSort}
                  onChange={(event) => setSelectedSort(event.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="region">Region</option>
                  <option value="theme">Research theme</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Research papers</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredPapers.length} paper
                {filteredPapers.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <h3 className="text-lg font-semibold text-foreground">No papers found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your search query or filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredPapers.map((paper) => (
                <article
                  key={paper.id}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                      {paper.region}
                    </span>

                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {paper.theme}
                    </span>

                    <span className="text-muted-foreground">{paper.year}</span>

                    {paper.openAccess && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 font-medium text-green-700 dark:text-green-400">
                        Open Access
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-7 text-foreground">
                    {paper.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">{paper.authors.join(", ")}</p>

                  <p className="mt-1 text-sm italic text-muted-foreground">{paper.journal}</p>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {paper.abstract}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {paper.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {paper.paperUrl && (
                      <a
                        href={paper.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                      >
                        View paper
                      </a>
                    )}

                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                      >
                        Open PDF
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PublicShell>
  );
}
