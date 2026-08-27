import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p>
        AI-generated responses may contain errors or omissions. Review important information before
        relying on it. Do not enter confidential or sensitive information.
      </p>
    </div>
  );
}
