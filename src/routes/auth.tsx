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
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("resetEmail") as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
        const userIndex = users.findIndex((u: any) => u.email === email);
        
        if (userIndex !== -1) {
          users[userIndex].password = newPassword;
          localStorage.setItem("mock_users", JSON.stringify(users));
          toast.success("Password reset successfully!", {
            description: "You can now sign in with your new password.",
          });
          setIsForgotPassword(false);
        } else {
          toast.error("No account found.", {
            description: `We couldn't find an account associated with ${email}.`,
          });
        }
      } catch (err) {
        toast.error("An error occurred while resetting the password.");
      }
      setPending(false);
    }, 500);
  }

  function useDemoAccount(index: number) {
    const account = demoAccounts[index]!;
    const { hint: _hint, ...session } = account;
    signIn(session);
    toast.success(`Signed in as ${session.name}`, { description: `Role: ${session.role}` });
    void navigate({ to: session.role === "admin" ? "/admin" : "/dashboard" });
  }

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
        const found = users.find((u: any) => u.email === email && u.password === password);
        
        if (found) {
          signIn({ id: found.id, name: found.name, role: found.role });
          toast.success(`Welcome back, ${found.name}!`);
          void navigate({ to: "/dashboard" });
        } else {
          toast.error("Invalid email or password.", { description: "Please check your credentials or register a new account." });
        }
      } catch (err) {
        toast.error("Authentication failed.");
      }
      setPending(false);
    }, 500);
  }

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("rname") as HTMLInputElement).value;
    const email = (form.elements.namedItem("remail") as HTMLInputElement).value;
    const institution = (form.elements.namedItem("rinst") as HTMLInputElement).value;
    const password = (form.elements.namedItem("rpassword") as HTMLInputElement).value;

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
        if (users.find((u: any) => u.email === email)) {
          toast.error("An account with this email already exists.");
          setPending(false);
          return;
        }

        const newUser = {
          id: `usr_${Date.now()}`,
          name,
          email,
          institution,
          password,
          role: "researcher"
        };
        
        users.push(newUser);
        localStorage.setItem("mock_users", JSON.stringify(users));
        
        signIn({ id: newUser.id, name: newUser.name, role: newUser.role as any });
        toast.success("Registration successful!", {
          description: "Your account has been created and you are now signed in.",
        });
        void navigate({ to: "/dashboard" });
      } catch (err) {
        toast.error("Registration failed.");
      }
      setPending(false);
    }, 500);
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
<<<<<<< HEAD
              {isForgotPassword ? (
                <form
                  className="space-y-4 rounded-xl border border-border bg-card p-6"
                  onSubmit={handleForgotPassword}
                >
                  <div>
                    <h3 className="font-semibold text-lg">Reset your password</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your institutional email and your new password to update your credentials.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="resetEmail">Institutional email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      required
                      className="mt-1.5"
                      placeholder="name@institution.res.in"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={pending}>
                    Reset Password
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setIsForgotPassword(false)}>
                    Back to sign in
                  </Button>
                </form>
              ) : (
                <form
                  className="space-y-4 rounded-xl border border-border bg-card p-6"
                  onSubmit={handleSignIn}
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs text-accent hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
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
              )}
=======
              <form
                className="space-y-4 rounded-xl border border-border bg-card p-6"
                onSubmit={handleSignIn}
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
>>>>>>> d7a7a9d2fe368a703d63cb8b4ab81ac0d0153b51
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <form
                className="space-y-4 rounded-xl border border-border bg-card p-6"
                onSubmit={handleRegister}
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
                    <Label htmlFor="rpassword">Password</Label>
                    <Input id="rpassword" type="password" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="orcid">ORCID (optional)</Label>
                    <Input id="orcid" className="mt-1.5" placeholder="0000-0000-0000-0000" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
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
