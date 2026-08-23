import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/site/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoAccounts } from "@/features/auth/session";
import { useSession } from "@/features/auth/useSession";

const title = "Sign in | India Polar Science Portal";
const description =
  "Sign in to submit datasets, request restricted polar data and track review status, or register for a verified researcher account.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, user } = useSession();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  function useDemoAccount(index: number) {
    const account = demoAccounts[index]!;
    const { hint: _hint, ...session } = account;
    signIn(session);
    toast.success(`Signed in as ${session.name}`, { description: `Role: ${session.role}` });
    void navigate({ to: session.role === "admin" ? "/admin" : "/dashboard" });
  }

  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl font-bold">Sign in to the portal</h1>
          <p className="mt-3 text-muted-foreground">
            Accounts are issued to researchers at Indian institutions and to approved international
            collaborators. Signing in enables dataset submission, restricted-data requests and
            download history.
          </p>

          <Tabs defaultValue="signin" className="mt-8">
            <TabsList>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <form
                className="space-y-4 rounded-xl border border-border bg-card p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPending(true);
                  toast.info("Credential sign-in requires the API", {
                    description:
                      "Attach the Express auth service (POLAR_API_URL) to exchange credentials for a JWT. Use a demo role below to explore the UI.",
                  });
                  setPending(false);
                }}
              >
                <div>
                  <Label htmlFor="email">Institutional email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1.5"
                    placeholder="name@institution.res.in"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
                  <KeyRound className="mr-2 size-4" aria-hidden />
                  Sign in
                </Button>
                <p className="text-xs text-muted-foreground">
                  Sessions use a 15-minute JWT access token and a rotating refresh cookie with
                  reuse detection. No credentials are stored in the browser.
                </p>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <form
                className="space-y-4 rounded-xl border border-border bg-card p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Registration request recorded (demo)", {
                    description: "A curator verifies institutional affiliation before activation.",
                  });
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="rname">Full name</Label>
                    <Input id="rname" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="remail">Institutional email</Label>
                    <Input id="remail" type="email" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="rinst">Institution</Label>
                    <Input id="rinst" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="orcid">ORCID (optional)</Label>
                    <Input id="orcid" className="mt-1.5" placeholder="0000-0000-0000-0000" />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Request an account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <aside>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <ShieldCheck className="size-5 text-accent" aria-hidden />
              Explore with a demo role
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Role-based access control shapes what each account can see. Pick a role to preview the
              corresponding dashboard — no password, no data leaves your browser.
            </p>
            <ul className="mt-5 space-y-3">
              {demoAccounts.map((a, i) => (
                <li key={a.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{a.name}</span>
                    <Badge variant="secondary">{a.role}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.hint}</p>
                  <Button size="sm" className="mt-3" onClick={() => useDemoAccount(i)}>
                    Continue as {a.role}
                  </Button>
                </li>
              ))}
            </ul>
            {user && (
              <p className="mt-4 text-sm">
                Currently signed in as {user.name}.{" "}
                <Link to="/dashboard" className="text-accent underline-offset-4 hover:underline">
                  Go to dashboard
                </Link>
              </p>
            )}
          </div>
        </aside>
      </section>
    </PublicShell>
  );
}
