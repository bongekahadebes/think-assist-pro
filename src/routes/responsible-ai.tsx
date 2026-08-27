import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, UserCheck, Lock, Scale, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | AI Workplace" },
      {
        name: "description",
        content:
          "How to use AI responsibly at work: accuracy, human oversight, privacy, bias and fact checking.",
      },
      { property: "og:title", content: "Responsible AI at work" },
      {
        property: "og:description",
        content: "Accuracy, human oversight, privacy, bias and fact checking guidance.",
      },
    ],
  }),
  component: ResponsibleAI,
});

const POINTS = [
  {
    icon: AlertTriangle,
    title: "AI can make mistakes",
    body: "AI models predict likely text. They can produce confident answers that are incomplete, out of date or simply wrong. Treat every output as a first draft, never as verified truth.",
  },
  {
    icon: UserCheck,
    title: "Human oversight",
    body: "A person must review and approve anything before it is sent, published or acted upon. You remain accountable for the final decision and its consequences.",
  },
  {
    icon: Lock,
    title: "Privacy",
    body: "Do not enter confidential, personal or client-identifying information into AI tools. Remove names, ID numbers, contract details and anything covered by your organisation's data policy.",
  },
  {
    icon: Scale,
    title: "Bias",
    body: "AI learns from human-created data and can reflect stereotypes or blind spots. Be especially careful with anything affecting hiring, performance, pay or customer treatment.",
  },
  {
    icon: CheckCircle2,
    title: "Fact checking",
    body: "Verify figures, dates, legal points, policies and any claim you would not defend yourself. This assistant has no live web access, so its answers are based on prior knowledge only.",
  },
] as const;

function ResponsibleAI() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Responsible AI"
        subtitle="Use AI as a helpful assistant, with judgement and accountability that stay human."
      />
      <AiDisclaimer />

      <div className="grid gap-4 sm:grid-cols-2">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-accent">
              <Icon className="size-5 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
