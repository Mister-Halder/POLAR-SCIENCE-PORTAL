import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/submissions")({
  component: AdminSubmissions,
});

interface Submission {
  id: string;
  title: string;
  pi: string;
  theme: string;
  submitted: string;
  files: number;
  sizeGb: number;
  state: "submitted" | "in review" | "changes requested" | "published";
}

const initial: Submission[] = [
  {
    id: "sub-2026-041",
    title: "Bharati snow-pit density and stratigraphy, 2025-26",
    pi: "Debashis Halder",
    theme: "Glaciology",
    submitted: "2026-08-14",
    files: 4,
    sizeGb: 1.8,
    state: "in review",
  },
  {
    id: "sub-2026-039",
    title: "Prydz Bay coastal bathymetry multibeam compilation",
    pi: "Dr. Nandita Bose",
    theme: "Geology & Geophysics",
    submitted: "2026-08-11",
    files: 9,
    sizeGb: 62.4,
    state: "submitted",
  },
  {
    id: "sub-2026-033",
    title: "Kongsfjorden mesozooplankton net hauls, summer 2025",
    pi: "Dr. Sanjana Pillai",
    theme: "Biology & Ecology",
    submitted: "2026-08-02",
    files: 3,
    sizeGb: 0.4,
    state: "changes requested",
  },
  {
    id: "sub-2026-027",
    title: "Maitri ozone and UV-B column measurements, 2025",
    pi: "Dr. Kavya Iyer",
    theme: "Atmospheric Science",
    submitted: "2026-07-24",
    files: 2,
    sizeGb: 0.2,
    state: "submitted",
  },
];

const stateStyles: Record<Submission["state"], string> = {
  submitted: "bg-secondary text-secondary-foreground",
  "in review": "bg-accent text-accent-foreground",
  "changes requested": "bg-warning text-warning-foreground",
  published: "bg-success text-success-foreground",
};

function AdminSubmissions() {
  const [rows, setRows] = useState(initial);
  const [selected, setSelected] = useState<string | null>(null);

  function decide(id: string, state: Submission["state"], message: string) {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, state } : row)));
    setSelected(null);
    toast.success(message, {
      description: "Demo action — the API records the decision and notifies the submitter.",
    });
  }

  const active = rows.find((r) => r.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Submission queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Validate metadata completeness and licence choice, then publish to mint a DataCite DOI.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>PI</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead className="text-right">Files</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead>State</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="max-w-xs">{r.title}</TableCell>
                <TableCell className="whitespace-nowrap">{r.pi}</TableCell>
                <TableCell className="whitespace-nowrap">{r.theme}</TableCell>
                <TableCell className="text-right tabular-nums">{r.files}</TableCell>
                <TableCell className="text-right tabular-nums">{r.sizeGb} GB</TableCell>
                <TableCell>
                  <Badge className={stateStyles[r.state]}>{r.state}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setSelected(r.id)}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {active && (
        <section className="rounded-xl border border-accent bg-card p-6">
          <h3 className="font-display text-lg font-bold">Reviewing {active.id}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{active.title}</p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <li>Metadata schema validation: passed</li>
            <li>Checksum verification: {active.files} of {active.files} files matched</li>
            <li>Licence: CC BY 4.0 — compatible with the data policy</li>
            <li>Embargo: none requested</li>
          </ul>
          <label className="mt-4 block text-sm font-medium" htmlFor="note">
            Reviewer note to the submitter
          </label>
          <Textarea id="note" rows={3} className="mt-1.5" placeholder="Optional note…" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => decide(active.id, "published", `Published ${active.id} and minted a DOI`)}>
              Approve and publish
            </Button>
            <Button
              variant="outline"
              onClick={() => decide(active.id, "changes requested", `Changes requested on ${active.id}`)}
            >
              Request changes
            </Button>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Cancel
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
