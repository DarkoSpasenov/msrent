export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="container-x max-w-3xl pt-10 pb-24 sm:pt-16">
      <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-brand-ink [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-ink">
        {children}
      </div>
    </article>
  );
}
