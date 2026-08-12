import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { glossary } from "@/content/glossary";
import { glossarySection } from "@/content";

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return glossary;
    return glossary
      .map((g) => ({
        ...g,
        terms: g.terms.filter(
          (t) => t.term.toLowerCase().includes(needle) || t.def.toLowerCase().includes(needle)
        ),
      }))
      .filter((g) => g.terms.length > 0);
  }, [q]);

  const total = glossary.reduce((a, g) => a + g.terms.length, 0);
  const shown = filtered.reduce((a, g) => a + g.terms.length, 0);

  return (
    <article>
      <header className="border-b border-line px-6 pb-10 pt-12 sm:px-12 lg:px-16">
        <p className="meta-label rise">{glossarySection.group}</p>
        <h1 className="rise rise-1 mt-4 max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-[44px]">
          {glossarySection.title}
        </h1>
        <p className="rise rise-2 mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{glossarySection.subtitle}</p>
        <div className="rise rise-3 mt-7 flex max-w-md items-center gap-3 rounded-lg border border-line bg-white px-4 py-3">
          <Search className="h-4.5 w-4.5 h-5 w-5 shrink-0 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Знайти термін…"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
          />
          <span className="shrink-0 font-mono2 text-[11px] text-ink-faint">
            {shown}/{total}
          </span>
        </div>
      </header>
      <div className="max-w-3xl px-6 pb-20 sm:px-12 lg:px-16">
        {filtered.map((g) => (
          <section key={g.name} className="mt-12">
            <h3 className="mb-2 border-t-2 border-[hsl(var(--ink))] pt-4 text-[20px] font-bold tracking-[-0.01em]">
              {g.name}
              <span className="ml-3 font-mono2 text-[12px] font-normal text-ink-faint">{g.terms.length}</span>
            </h3>
            <dl>
              {g.terms.map((t) => (
                <div key={t.term} className="grid gap-1 border-b border-dashed border-line py-3.5 sm:grid-cols-[240px_1fr] sm:gap-6">
                  <dt className="font-mono2 text-[13.5px] font-semibold leading-relaxed">{t.term}</dt>
                  <dd className="text-[14.5px] leading-relaxed text-ink-soft">{t.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="mt-12 text-ink-faint">Нічого не знайдено за запитом «{q}».</p>
        )}
      </div>
    </article>
  );
}
