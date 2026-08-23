import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero, PublicShell } from "@/components/site/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const title = "Contact the polar data centre | India Polar Science Portal";
const description =
  "Reach the NCPOR data centre, media desk and expedition office for data queries, collaboration proposals, media requests and access requests.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

const desks = [
  {
    icon: Mail,
    name: "Data centre",
    detail: "polardata@ncpor.res.in",
    body: "Dataset formats, DOI queries, corrections and restricted-access decisions.",
  },
  {
    icon: Building2,
    name: "Expedition office",
    detail: "expeditions@ncpor.res.in",
    body: "Berth applications, medical screening and logistics for upcoming campaigns.",
  },
  {
    icon: Phone,
    name: "Media desk",
    detail: "+91 832 252 5501",
    body: "Interviews, image licensing and filming requests from the stations.",
  },
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to the polar programme"
        lead="Whether you need a dataset in a different format, want to propose a collaboration, or are reporting on polar science, the relevant desk is listed below."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold">Send a message</h2>
            <form
              className="mt-6 space-y-5 rounded-xl border border-border bg-card p-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                toast.success("Message queued (demo)", {
                  description:
                    "With the API attached this creates an enquiry record and emails the selected desk.",
                });
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required autoComplete="name" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required autoComplete="email" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="institution">Institution or organisation</Label>
                  <Input id="institution" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="desk">Desk</Label>
                  <Select defaultValue="Data centre">
                    <SelectTrigger id="desk" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {desks.map((d) => (
                        <SelectItem key={d.name} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required rows={6} className="mt-1.5" />
              </div>
              <Button type="submit" size="lg">
                {sent ? "Message sent" : "Send message"}
              </Button>
              <p className="text-xs text-muted-foreground">
                We reply within five working days. Do not send personal health information or
                unpublished third-party data through this form.
              </p>
            </form>
          </div>

          <aside className="space-y-4">
            {desks.map((d) => (
              <article key={d.name} className="rounded-xl border border-border bg-card p-5">
                <d.icon className="size-5 text-accent" aria-hidden />
                <h2 className="mt-2 font-display text-lg font-semibold">{d.name}</h2>
                <p className="mt-1 text-sm font-medium">{d.detail}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
              </article>
            ))}
            <div className="rounded-xl border border-border bg-muted/40 p-5 text-sm">
              <h2 className="font-semibold">Visiting address</h2>
              <address className="mt-2 not-italic text-muted-foreground">
                National Centre for Polar and Ocean Research
                <br />
                Headland Sada, Vasco-da-Gama
                <br />
                Goa 403804, India
              </address>
              <p className="mt-3 text-xs text-muted-foreground">
                Office hours 09:30–18:00 IST, Monday to Friday.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
