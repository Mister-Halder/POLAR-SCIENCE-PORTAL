import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ClipboardList, Home, LayoutDashboard, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from "@/features/auth/useSession";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin console | India PolaRis" },
      {
        name: "description",
        content:
          "Curator and administrator console for reviewing dataset submissions, managing users and roles, and auditing portal activity.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin" as const, label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/submissions" as const, label: "Submissions", icon: ClipboardList, exact: false },
  { to: "/admin/users" as const, label: "Users & roles", icon: Users, exact: false },
];

function AdminLayout() {
  const { user, ready } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const authorised = user?.role === "admin" || user?.role === "curator";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-5 text-sidebar-foreground lg:flex">
        <p className="font-display text-lg font-semibold">Polar Portal</p>
        <p className="text-xs text-sidebar-foreground/70">Administration</p>
        <nav aria-label="Admin sections" className="mt-8 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                )}
              >
                <n.icon className="size-4" aria-hidden />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/"
          className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
        >
          <Home className="size-4" aria-hidden />
          Back to public site
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-3">
          <h1 className="font-display text-lg font-semibold">Admin console</h1>
          <nav aria-label="Admin sections mobile" className="flex gap-1 lg:hidden">
            {nav.map((n) => (
              <Button key={n.to} asChild size="sm" variant="ghost">
                <Link to={n.to}>{n.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline">{user.name}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        </header>

        <main id="main" className="flex-1 p-4 sm:p-6">
          {!ready ? (
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
          ) : authorised ? (
            <Outlet />
          ) : (
            <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center">
              <h2 className="font-display text-xl font-bold">Curator or administrator access required</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                This console is protected by role-based access control. Sign in with a curator or
                admin role to continue; in production the API rejects every request without the
                matching role claim, not just the UI.
              </p>
              <Button asChild className="mt-6">
                <Link to="/auth">Choose a role</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
