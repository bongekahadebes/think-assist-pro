import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AiError, AiLoading, EmptyState } from "@/components/AiStates";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace" },
      {
        name: "description",
        content:
          "Research workplace topics with structured overviews, key information, insights and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured, honest AI research summaries for workplace topics.",
      },
    ],
  }),
  component: ResearchPage,
});

const TYPES = ["Quick Summary", "Detailed Analysis", "Key Insights", "Recommendations"];
const SECTIONS = ["Overview", "Key Information", "Insights", "Recommendations", "Sources"];

function plain(text: string) {
  return text
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^\s*[*-]\s+/gm, "\u2022 ")
    .trim();
}

function splitSections(text: string) {
  const result: Array<{ heading: string; body: string }> = [];
  const lines = text.split("\n");
  let current: { heading: string; body: string[] } | null = null;

  for (const line of lines) {
    const clean = line.replace(/[#*_]/g, "").replace(/:$/, "").trim();
    const match = SECTIONS.find((s) => clean.toLowerCase() === s.toLowerCase());
    if (match) {
      if (current) result.push({ heading: current.heading, body: current.body.join("\n").trim() });
      current = { heading: match, body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) result.push({ heading: current.heading, body: current.body.join("\n").trim() });
  return result;
}

function ResearchPage() {
  const research = useServerFn(runResearch);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("Quick Summary");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!question.trim()) {
      toast.error("Enter a research question first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await research({ data: { question, type } });
      setOutput(res.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong running your research.");
    } finally {
      setLoading(false);
    }
  }

  const sections = output ? splitSections(output) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        subtitle="Research, summarise and generate insights on workplace topics."
      />
      <AiDisclaimer />

      <section className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="question">Research question</Label>
          <Textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder="e.g. What are effective ways to reduce staff turnover in a call centre?"
            className="min-h-32 resize-y rounded-xl"
          />
        </div>

        <div className="grid gap-4 sm:max-w-xs">
          <div className="space-y-2">
            <Label htmlFor="type">Research type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="w-full rounded-xl">
                <SelectValue placeholder="Research type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={run} disabled={loading} className="w-full rounded-xl sm:w-auto">
          <Search className="size-4" aria-hidden />
          {loading ? "Researching..." : "Research with AI"}
        </Button>
      </section>

      {loading && <AiLoading />}
      {error && !loading && <AiError message={error} onRetry={run} />}

      {!loading && !error && !output && (
        <EmptyState
          title="No research yet"
          body="Ask a question above to get a structured overview, insights and recommendations."
        />
      )}

      {output && !loading && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              AI-generated based on available knowledge. No live web research was performed.
            </p>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(output);
                  toast.success("Research copied to clipboard");
                } catch {
                  toast.error("Could not copy. Select the text and copy manually.");
                }
              }}
            >
              <Copy className="size-4" aria-hidden /> Copy
            </Button>
          </div>

          {sections.length > 0 ? (
            sections.map((s) => (
              <article key={s.heading} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-foreground">{s.heading}</h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                  {plain(s.body) || "Not provided."}
                </p>
              </article>
            ))
          ) : (
            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                {plain(output)}
              </p>
            </article>
          )}
        </section>
      )}
    </div>
  );
}
