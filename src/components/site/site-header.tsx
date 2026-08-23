import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Snowflake, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { primaryNav, site } from "@/features/site/content";
import { useSession } from "@/features/auth/useSession";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("moes-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = stored ? stored === "dark" : prefers;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        window.localStorage.setItem("moes-theme", next ? "dark" : "light");
      }}
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </Button>
  );
}

function NavLinks({ onNavigate, vertical }: { onNavigate?: () => void; vertical?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <ul className={cn("flex gap-1", vertical ? "flex-col" : "items-center")}>
      {primaryNav.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                vertical && "text-base",
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] sm:text-xs">
          <p className="font-medium uppercase tracking-[0.14em]">{site.ministry}</p>
          <p className="text-primary-foreground/80">Operated by {site.operator}</p>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg polar-gradient text-primary-foreground">
              <Snowflake className="size-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold sm:text-lg">
                Polar Science Portal
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Antarctic · Arctic · Southern Ocean · Himalaya
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <NavLinks />
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to={user ? "/dashboard" : "/auth"}>
                <UserRound className="mr-1.5 size-4" aria-hidden />
                {user ? "Dashboard" : "Sign in"}
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-6">
                <SheetTitle className="mb-4 font-display text-lg">Navigate</SheetTitle>
                <nav aria-label="Mobile">
                  <NavLinks vertical onNavigate={() => setOpen(false)} />
                </nav>
                <div className="mt-6 grid gap-2">
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to={user ? "/dashboard" : "/auth"}>{user ? "Dashboard" : "Sign in"}</Link>
                  </Button>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/admin">Admin console</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
