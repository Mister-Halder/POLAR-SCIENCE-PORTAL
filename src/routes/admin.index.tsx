import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Database, HardDrive, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { datasets } from "@/features/repository/data";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const auditLog = [
  { at: "2026-08-22 14:02 IST", actor: "r.das@ncpor.res.in", action: "dataset.publish", target: "ds-cryoconite-16s" },
  { at: "2026-08-22 11:47 IST", actor: "a.sen@ncpor.res.in", action: "submission.create", target: "sub-2026-041" },
  { at: "2026-08-21 18:20 IST", actor: "r.das@ncpor.res.in", action: "access-request.approve", target: "req-0912" },
  { at: "2026-08-21 09:05 IST", actor: "admin@polar.moes.gov.in", action: "user.role.grant", target: "u-curator → curator" },
  { at: "2026-08-20 16:33 IST", actor: "system", action: "search.index.rebuild", target: "datasets (1,286 docs)" },
];

function AdminOverview() {
  const totalGb = datasets.reduce((s, d) => s + d.files.reduce((t, f) => t + f.sizeMb, 0), 0) / 1024;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Database, label: "Published datasets", value: "1,286" },
          { icon: Clock, label: "Awaiting review", value: "14" },
          { icon: Users, label: "Active accounts", value: "742" },
          { icon: HardDrive, label: "Object storage in use", value: `${totalGb.toFixed(1)} GB (demo set)` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <s.icon className="size-5 text-accent" aria-hidden />
            <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Service health</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Postgres 16", state: "connected" },
            { name: "Meilisearch", state: "index fresh" },
            { name: "S3 object storage", state: "reachable" },
            { name: "Mail relay", state: "degraded" },
          ].map((s) => (
            <li key={s.name} className="rounded-lg border border-border p-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={s.state === "degraded" ? "size-4 text-warning" : "size-4 text-success"}
                  aria-hidden
                />
                <span className="font-medium">{s.name}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.state}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Status is illustrative until the API health endpoint (<code>/v1/health</code>) is wired up.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Audit log</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {auditLog.map((l) => (
            <li key={l.at} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
              <time className="w-44 shrink-0 font-mono text-xs text-muted-foreground">{l.at}</time>
              <Badge variant="outline">{l.action}</Badge>
              <span className="text-muted-foreground">{l.actor}</span>
              <span className="font-medium">{l.target}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
