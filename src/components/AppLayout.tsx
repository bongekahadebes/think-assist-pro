import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  Search,
  MessagesSquare,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/research", label: "AI Research", icon: Search },
  { to: "/chat", label: "Workplace Chat", icon: MessagesSquare },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <span className="grid size-9 place-items-center rounded-xl bg-primary">
        <Sparkles className="size-5 text-primary-foreground" aria-hidden />
      </span>
      <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
        AI Workplace
      </span>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-6 bg-sidebar p-4 lg:flex">
        <Brand />
        <NavLinks />
        <p className="mt-auto px-2 text-[11px] leading-relaxed text-sidebar-foreground/45">
          AI-generated content may contain errors. Always review before use.
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-xl text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          {open ? <Menu className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col gap-6 bg-sidebar p-4 shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-xl text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
