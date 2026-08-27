import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, SendHorizonal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AiError, AiLoading } from "@/components/AiStates";
import { chatReply } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace AI Chat | AI Workplace" },
      {
        name: "description",
        content: "Ask workplace questions and get specific, practical AI guidance in a chat interface.",
      },
      { property: "og:title", content: "Workplace AI Chat" },
      {
        property: "og:description",
        content: "Practical answers to everyday workplace questions.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const EXAMPLES = [
  "How can I improve customer service?",
  "Give me ways to increase workplace productivity.",
  "Explain AI automation simply.",
];

function ChatPage() {
  const reply = useServerFn(chatReply);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await reply({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong getting a reply.");
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((m) => m.filter((_, i) => i !== m.length - 1 || m[i].role !== "user"));
    setError(null);
    void send(lastUser.content);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Workplace AI Chat"
          subtitle="Ask workplace questions and receive practical, specific answers."
        />
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => {
            setMessages([]);
            setError(null);
            setInput("");
          }}
        >
          <Plus className="size-4" aria-hidden /> New Chat
        </Button>
      </div>

      <AiDisclaimer />

      <section className="flex min-h-[50vh] flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        {messages.length === 0 && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Start a conversation</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Try one of these prompts, or ask your own workplace question.
            </p>
            <div className="flex w-full max-w-xl flex-col gap-2">
              {EXAMPLES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => send(e)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.content}
                {m.role === "assistant" && (
                  <button
                    type="button"
                    aria-label="Copy answer"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(m.content);
                        toast.success("Answer copied");
                      } catch {
                        toast.error("Could not copy.");
                      }
                    }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Copy className="size-3.5" aria-hidden /> Copy
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && <AiLoading />}
          {error && !loading && <AiError message={error} onRetry={retry} />}
          <div ref={endRef} />
        </div>
      </section>

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <Textarea
          aria-label="Your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={1}
          placeholder="Ask a workplace question..."
          className="max-h-40 min-h-12 flex-1 resize-y rounded-xl"
        />
        <Button type="submit" disabled={loading} className="h-12 rounded-xl px-4">
          <SendHorizonal className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
