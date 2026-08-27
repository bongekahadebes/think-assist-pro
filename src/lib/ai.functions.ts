import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function callAI(messages: Msg[]): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing API key.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits have run out for this workspace. Please add credits to continue.");
    if (res.status === 403) throw new Error("AI access is blocked for this workspace.");
    throw new Error(`AI request failed (${res.status}). ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const out = data.choices?.[0]?.message?.content?.trim();
  if (!out) throw new Error("The AI returned an empty response. Please try again.");
  return out;
}

const EmailInput = z.object({
  prompt: z.string().min(1),
  recipient: z.string().min(1),
  tone: z.string().min(1),
  length: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const content = await callAI([
      {
        role: "system",
        content:
          "You are a professional workplace email writer. Generate the finished professional email directly. Do not explain how to write it. Do not provide instructions, commentary or placeholders in brackets unless a real detail is genuinely unknown. Always include: a line starting with 'Subject:' followed by a relevant subject, a greeting, a professional body, and a closing with a sign-off.",
      },
      {
        role: "user",
        content: `Write an email.\nRecipient type: ${data.recipient}\nTone: ${data.tone}\nLength: ${data.length} (Short = under 100 words, Medium = 100-180 words, Detailed = 200-300 words)\n\nWhat the email must say:\n${data.prompt}`,
      },
    ]);
    return { content };
  });

const ResearchInput = z.object({
  question: z.string().min(1),
  type: z.string().min(1),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const content = await callAI([
      {
        role: "system",
        content:
          "You are a workplace research assistant. Provide useful, structured and factual information. Do not fabricate sources or facts. You have no live web access, so state that the answer is AI-generated based on available knowledge and may be out of date. Respond in markdown-free plain text using EXACTLY these section headings on their own lines, in this order: Overview, Key Information, Insights, Recommendations, Sources. Under Sources, do not invent URLs or citations; instead name general types of authoritative sources the reader should verify against, and clearly state the limitation.",
      },
      {
        role: "user",
        content: `Research type: ${data.type}\n\nResearch question:\n${data.question}`,
      },
    ]);
    return { content };
  });

const ChatInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1),
});

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const content = await callAI([
      {
        role: "system",
        content:
          "You are a practical workplace AI assistant. Answer the user's actual workplace question with practical, specific and informative guidance. Avoid generic filler, avoid restating the question, and get straight to useful substance. Use short paragraphs and bullet points where helpful. Be honest about uncertainty.",
      },
      ...data.messages,
    ]);
    return { content };
  });
