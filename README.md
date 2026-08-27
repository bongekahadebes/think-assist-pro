# AI Workplace Assistant

Build a modern responsive SaaS-style web app called 'AI Workplace Productivity Assistant'.

IMPORTANT

Keep the project simple. No Supabase, database, authentication, user accounts, admin panel or custom backend. Focus on a polished frontend and functional AI interaction using Lovable's simplest supported AI integration.

DESIGN

Use ONLY:

* Black #000000

* White #FFFFFF

* Blue #2563EB

* Light grey only for subtle backgrounds/borders

Style: modern, professional, premium SaaS. Clean spacing, strong typography, subtle animations, rounded cards and professional icons. Use Inter or a similar modern font.

Must be fully responsive on desktop, tablet and mobile.

SIDEBAR

Black sidebar with:

**AI Workplace**

* Dashboard

* Smart Email

* AI Research

* Workplace Chat

* Responsible AI

Blue highlight for the active page.

On mobile, convert sidebar to a hamburger menu.

DASHBOARD

Title:

**AI Workplace Productivity Assistant**

Subtitle:

**Work smarter. Communicate better. Research faster.**

Create 3 main feature cards:

**Smart Email Generator**

Generate professional workplace emails.

**AI Research Assistant**

Research, summarise and generate insights.

'Workplace AI Chat'

Ask workplace questions and receive useful answers.

Each card has a blue action button.

SMART EMAIL

Create:

Large prompt textarea

Recipient dropdown: Manager, Client, Colleague, HR, Supplier, Other

Tone: Formal, Friendly, Persuasive

Length: Short, Medium, Detailed

*Generate Email*button

AI MUST generate the **actual finished email**, not instructions about writing an email.

Output must contain:

* Relevant subject

* Greeting

* Professional email body

* Closing

Example input:

"I need to ask my manager for leave from 12 to 16 September."

The AI should generate the finished email directly.

Make output editable.

Buttons:

Copy | Regenerate | Clear

AI RESEARCH

Create:

Research question textarea

Research type: Quick Summary, Detailed Analysis, Key Insights, Recommendations

Research with AI button

Output sections:

Overview

Key Information

Insights

Recommendations

Sources

Do not fabricate facts or sources. If live web research is unavailable, clearly label the response as AI-generated based on available knowledge.

WORKPLACE CHAT

Create a clean ChatGPT-style interface with:

Chat messages

AI responses

Input box

Send button

New Chat button

AI should give specific, practical and informative workplace answers, not generic filler.

Add example prompts:

"How can I improve customer service?"

"Give me ways to increase workplace productivity."

"Explain AI automation simply."

RESPONSIBLE AI

Create a simple page explaining:

AI can make mistakes

Human oversight

Privacy

Bias

Fact checking

Show this disclaimer on AI pages:

"AI-generated responses may contain errors or omissions. Review important information before relying on it. Do not enter confidential or sensitive information."

AI PROMPT BEHAVIOUR

Use structured prompts.

Email AI:

"Generate the finished professional email directly. Do not explain how to write it. Do not provide instructions. Include a relevant subject and professional body."

Research AI:

"Provide useful, structured and factual information. Do not fabricate sources or facts. Clearly state limitations."

Chat AI:

"Answer the user's actual workplace question with practical, specific and informative guidance. Avoid generic filler."

UX

Include:

Loading state: "AI is working on your response..."

Friendly error state with Try Again

Copy functionality

Editable AI outputs

Clear empty states

Accessible buttons/forms

No horizontal scrolling

FINAL REQUIREMENT

Build this as a polished functional AI training project not a static mockup.

Prioritise:

REAL AI RESPONSES + PROFESSIONAL UI + BLACK/WHITE/BLUE DESIGN + RESPONSIVE MOBILE DESIGN + RESPONSIBLE AI.

Do not add unnecessary features that increase complexity.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://think-assist-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b99d95f5-47f2-496e-91c4-a1d32c309a25).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
