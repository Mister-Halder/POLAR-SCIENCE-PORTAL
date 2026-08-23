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
    curator: "Rukmini Das",
  },
  {
    id: "sub-2026-033",
    title: "Kongsfjorden mesozooplankton net hauls, summer 2025",
    state: "changes requested",
    updated: "2026-08-02",
    curator: "Rukmini Das",
  },
  {
    id: "sub-2026-018",
    title: "Firn core PC-44/03 stable isotope and black carbon stratigraphy",
    state: "published",
    updated: "2025-07-02",
    curator: "Rukmini Das",
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
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-10">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-bold">{user.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.institution} · role <Badge variant="secondary">{user.role}</Badge>
              {user.orcid ? ` · ORCID ${user.orcid}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/repository/upload">
                <Plus className="mr-1.5 size-4" aria-hidden />
                New submission
              </Link>
            </Button>
            {(user.role === "admin" || user.role === "curator") && (
              <Button asChild variant="outline">
                <Link to="/admin">Admin console</Link>
              </Button>
            )}
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="mr-1.5 size-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Database, label: "Datasets you have published", value: "6" },
            { icon: FileClock, label: "Submissions in review", value: "2" },
            { icon: Download, label: "Downloads of your data", value: "3,142" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <s.icon className="size-5 text-accent" aria-hidden />
              <p className="mt-3 font-display text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold">My submissions</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Curator</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="max-w-sm">{s.title}</TableCell>
                  <TableCell>
                    <Badge className={stateStyles[s.state]}>{s.state}</Badge>
                  </TableCell>
                  <TableCell>{s.curator}</TableCell>
                  <TableCell className="tabular-nums">{s.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Access requests</h2>
            <ul className="mt-4 space-y-3">
              {accessRequests.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium">{r.dataset}</span>
                    <Badge className={stateStyles[r.state]}>{r.state}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.id} · decision {r.decided}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Recent downloads</h2>
            <ul className="mt-4 space-y-3">
              {datasets.slice(0, 3).map((d) => (
                <li key={d.id} className="rounded-xl border border-border bg-card p-4">
                  <Link
                    to="/repository/$id"
                    params={{ id: d.id }}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {d.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.version} · {d.license}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="font-display text-lg font-bold">Your permissions</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {rolePermissions[user.role].map((p) => (
              <code key={p} className="rounded bg-card px-2 py-1 text-xs">
                {p}
              </code>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
