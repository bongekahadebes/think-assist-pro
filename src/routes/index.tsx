import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Search, MessagesSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work smarter. Communicate better. Research faster. AI tools for workplace email, research and chat.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Communicate better. Research faster.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Generate professional workplace emails.",
    cta: "Write an email",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    description: "Research, summarise and generate insights.",
    cta: "Start research",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "Workplace AI Chat",
    description: "Ask workplace questions and receive useful answers.",
    cta: "Open chat",
  },
] as const;

function Dashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Work smarter. Communicate better. Research faster.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, description, cta }) => (
          <article
            key={to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent">
              <Icon className="size-5 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <Button asChild className="mt-5 w-full rounded-xl">
              <Link to={to}>
                {cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </article>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
