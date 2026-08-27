import { Link, createFileRoute } from "@tanstack/react-router";
import { Database, Download, FileClock, LogOut, Plus, ShieldQuestion } from "lucide-react";

import { PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rolePermissions } from "@/features/auth/session";
import { useSession } from "@/features/auth/useSession";
import { datasets } from "@/features/repository/data";

const title = "My dashboard | India Polar Science Portal";
const description =
  "Track your dataset submissions, review status, download history and restricted-data access requests on the India Polar Science Portal.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const submissions = [
  {
    id: "sub-2026-041",
    title: "Bharati snow-pit density and stratigraphy, 2025-26",
    state: "in review",
    updated: "2026-08-14",
    curator: "Ashmita Roy Karmakar",
  },
  {
    id: "sub-2026-033",
    title: "Kongsfjorden mesozooplankton net hauls, summer 2025",
    state: "changes requested",
    updated: "2026-08-02",
    curator: "Ashmita Roy Karmakar",
  },
  {
    id: "sub-2026-018",
    title: "Firn core PC-44/03 stable isotope and black carbon stratigraphy",
    state: "published",
    updated: "2025-07-02",
    curator: "Ashmita Roy Karmakar",
  },
];

const accessRequests = [
  {
    id: "req-0912",
    dataset: "Cryoconite and meltwater plume microbial diversity",
    state: "approved",
    decided: "2026-07-19",
  },
  {
    id: "req-0938",
    dataset: "Sutri Dhaka glacier UAV photogrammetric DEM",
    state: "pending",
    decided: "—",
  },
];

const stateStyles: Record<string, string> = {
  published: "bg-success text-success-foreground",
  "in review": "bg-accent text-accent-foreground",
  "changes requested": "bg-warning text-warning-foreground",
  approved: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
};

function Dashboard() {
  const { user, ready, signOut } = useSession();

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
          <h1 className="mt-4 font-display text-2xl font-bold">Sign in to view your dashboard</h1>
          <p className="mt-3 text-muted-foreground">
            Submissions, download history and access requests are tied to your portal account.
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
      {/* Premium Glassmorphic Header */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background/40 backdrop-blur-2xl">
        {/* Subtle animated background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background opacity-50" />
        
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-12">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-blue-600 text-2xl font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-accent font-semibold">Welcome back</p>
                <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">{user.name}</h1>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/80">{user.institution}</span> 
              <span className="text-border">•</span> 
              Role: <Badge variant="secondary" className="bg-white/5 backdrop-blur-md border-white/10">{user.role}</Badge>
              {user.orcid && (
                <>
                  <span className="text-border">•</span> 
                  ORCID: <span className="font-mono text-accent">{user.orcid}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:shadow-accent/40">
              <Link to="/repository/upload">
                <Plus className="mr-1.5 size-4" aria-hidden />
                New submission
              </Link>
            </Button>
            {(user.role === "admin" || user.role === "curator") && (
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-0.5">
                <Link to="/admin">Admin console</Link>
              </Button>
            )}
            <Button variant="ghost" onClick={signOut} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="mr-1.5 size-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Database, label: "Datasets you have published", value: "6", gradient: "from-blue-500/20 to-cyan-500/5", glow: "text-blue-500" },
            { icon: FileClock, label: "Submissions in review", value: "2", gradient: "from-amber-500/20 to-orange-500/5", glow: "text-amber-500" },
            { icon: Download, label: "Downloads of your data", value: "3,142", gradient: "from-emerald-500/20 to-green-500/5", glow: "text-emerald-500" },
          ].map((s) => (
            <div key={s.label} className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${s.gradient} p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}>
              <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/5 blur-2xl transition-all group-hover:bg-white/10" />
              <div className={`inline-flex rounded-xl bg-background/50 p-3 shadow-inner ${s.glow}`}>
                <s.icon className="size-6" aria-hidden />
              </div>
              <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl font-bold tracking-tight">My submissions</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-card/50 shadow-2xl backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="font-semibold">Reference</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">State</TableHead>
                <TableHead className="font-semibold">Curator</TableHead>
                <TableHead className="font-semibold">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow key={s.id} className="group border-white/5 transition-colors hover:bg-white/[0.02]">
                  <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{s.id}</TableCell>
                  <TableCell className="max-w-sm font-medium">{s.title}</TableCell>
                  <TableCell>
                    <Badge className={`${stateStyles[s.state]} shadow-sm`}>{s.state}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.curator}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{s.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col">
            <h2 className="font-display text-2xl font-bold tracking-tight">Access requests</h2>
            <ul className="mt-6 space-y-4">
              {accessRequests.map((r) => (
                <li key={r.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-black/20">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <span className="text-base font-semibold leading-tight">{r.dataset}</span>
                    <Badge className={`${stateStyles[r.state]} shrink-0 shadow-sm`}>{r.state}</Badge>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">{r.id}</span>
                    <span>•</span>
                    <span>decision: {r.decided}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-2xl font-bold tracking-tight">Recent downloads</h2>
            <ul className="mt-6 space-y-4">
              {datasets.slice(0, 3).map((d) => (
                <li key={d.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-black/20">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <Link
                    to="/repository/$id"
                    params={{ id: d.id }}
                    className="block text-base font-semibold leading-tight decoration-accent decoration-2 underline-offset-4 group-hover:underline"
                  >
                    {d.title}
                  </Link>
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">Version {d.version}</span> • {d.license}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/5 bg-gradient-to-br from-muted/50 to-background p-8 shadow-inner relative overflow-hidden">
          <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-accent/5 to-transparent blur-3xl" />
          <h2 className="font-display text-xl font-bold tracking-tight">Your active permissions</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            These permissions are derived from your <strong className="text-foreground">{user.role}</strong> role and govern what data and actions you can perform on the portal.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {rolePermissions[user.role].map((p) => (
              <code key={p} className="rounded-lg border border-white/10 bg-background/50 px-3 py-1.5 text-xs font-medium text-accent shadow-sm backdrop-blur-md">
                {p}
              </code>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
