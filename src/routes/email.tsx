import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCcw, Eraser, Wand2 } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace" },
      {
        name: "description",
        content:
          "Generate finished professional workplace emails with the right tone, length and recipient.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate finished professional workplace emails in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const RECIPIENTS = ["Manager", "Client", "Colleague", "HR", "Supplier", "Other"];
const TONES = ["Formal", "Friendly", "Persuasive"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const generate = useServerFn(generateEmail);
  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("Manager");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!prompt.trim()) {
      toast.error("Describe what the email should say first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { prompt, recipient, tone, length } });
      setOutput(res.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating your email.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Could not copy. Select the text and copy manually.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Email Generator"
        subtitle="Describe what you need to say and get a finished, professional email."
      />
      <AiDisclaimer />

      <section className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">What should the email say?</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="e.g. I need to ask my manager for leave from 12 to 16 September."
            className="min-h-36 resize-y rounded-xl"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Recipient" value={recipient} onChange={setRecipient} options={RECIPIENTS} />
          <Field label="Tone" value={tone} onChange={setTone} options={TONES} />
          <Field label="Length" value={length} onChange={setLength} options={LENGTHS} />
        </div>

        <Button onClick={run} disabled={loading} className="w-full rounded-xl sm:w-auto">
          <Wand2 className="size-4" aria-hidden />
          {loading ? "Generating..." : "Generate Email"}
        </Button>
      </section>

      {loading && <AiLoading />}
      {error && !loading && <AiError message={error} onRetry={run} />}

      {!loading && !error && !output && (
        <EmptyState
          title="No email yet"
          body="Describe your message above and generate a ready-to-send draft."
        />
      )}

      {output && !loading && (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">Your email</h2>
            <span className="text-xs text-muted-foreground">Editable</span>
          </div>
          <Textarea
            aria-label="Generated email"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="min-h-80 resize-y rounded-xl font-normal leading-relaxed"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={copy} className="rounded-xl">
              <Copy className="size-4" aria-hidden /> Copy
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={run} disabled={loading}>
              <RefreshCcw className="size-4" aria-hidden /> Regenerate
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={() => {
                setOutput("");
                setPrompt("");
                setError(null);
              }}
            >
              <Eraser className="size-4" aria-hidden /> Clear
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`field-${label}`}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={`field-${label}`} className="w-full rounded-xl">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
