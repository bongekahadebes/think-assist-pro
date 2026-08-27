export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
    </header>
  );
}
