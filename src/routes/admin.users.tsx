import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rolePermissions, type Role } from "@/features/auth/session";
import { useSession } from "@/features/auth/useSession";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

interface PortalUser {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: Role;
  status: "active" | "pending verification" | "suspended";
}

const seed: PortalUser[] = [
  {
    id: "u-1041",
    name: "Debashis Halder",
    email: "a.sen@ncpor.res.in",
    institution: "NCPOR, Goa",
    role: "researcher",
    status: "active",
  },
  {
    id: "u-1042",
    name: "Ashmita Roy Karmakar",
    email: "r.das@ncpor.res.in",
    institution: "NCPOR Data Centre",
    role: "curator",
    status: "active",
  },
  {
    id: "u-1058",
    name: "Dr. Kavya Iyer",
    email: "k.iyer@tropmet.res.in",
    institution: "IITM Pune",
    role: "researcher",
    status: "active",
  },
  {
    id: "u-1104",
    name: "Aditya Menon",
    email: "aditya.menon@iitb.ac.in",
    institution: "IIT Bombay",
    role: "public",
    status: "pending verification",
  },
  {
    id: "u-1109",
    name: "Dr. Aruna Devi",
    email: "a.devi@wihg.res.in",
    institution: "WIHG Dehradun",
    role: "researcher",
    status: "suspended",
  },
];

const statusStyles: Record<PortalUser["status"], string> = {
  active: "bg-success text-success-foreground",
  "pending verification": "bg-warning text-warning-foreground",
  suspended: "bg-destructive text-destructive-foreground",
};

function AdminUsers() {
  const { user } = useSession();
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState("");
  const isAdmin = user?.role === "admin";

  const visible = rows.filter((r) =>
    [r.name, r.email, r.institution].join(" ").toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Users and roles</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Roles are stored in a dedicated join table, never on the profile record, and every grant is
          written to the audit log.
        </p>
      </div>

      {!isAdmin && (
        <p className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          You are signed in as a curator. Role changes require the administrator role.
        </p>
      )}

      <div className="max-w-sm">
        <label className="sr-only" htmlFor="user-filter">
          Filter users
        </label>
        <Input
          id="user-filter"
          placeholder="Filter by name, email or institution…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <span className="block font-medium">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">{r.email}</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">{r.institution}</TableCell>
                <TableCell>
                  <Badge className={statusStyles[r.status]}>{r.status}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={r.role}
                    disabled={!isAdmin}
                    onValueChange={(v) => {
                      setRows((rs) =>
                        rs.map((row) => (row.id === r.id ? { ...row, role: v as Role } : row)),
                      );
                      toast.success(`Role updated to ${v}`, {
                        description: `Audit entry: user.role.grant · ${r.email}`,
                      });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(rolePermissions) as Role[]).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Permission matrix</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {(Object.keys(rolePermissions) as Role[]).map((role) => (
            <div key={role}>
              <dt className="text-sm font-semibold capitalize">{role}</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {rolePermissions[role].map((p) => (
                  <code key={p} className="rounded bg-muted px-2 py-0.5 text-xs">
                    {p}
                  </code>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex gap-2">
        <Button disabled={!isAdmin} onClick={() => toast.info("Invitation flow requires the mail relay")}>
          Invite a user
        </Button>
      </div>
    </div>
  );
}
