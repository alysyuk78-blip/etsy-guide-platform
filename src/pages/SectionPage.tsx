import type { SectionDef, StageDef } from "@/content/types";
import { Blocks } from "@/components/Blocks";

function PageHead({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <header className="border-b border-line px-6 pb-10 pt-12 sm:px-12 lg:px-16">
      <p className="meta-label rise">{kicker}</p>
      <h1 className="rise rise-1 mt-4 max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-[44px]">
        {title}
      </h1>
      {subtitle && <p className="rise rise-2 mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{subtitle}</p>}
    </header>
  );
}

export function SectionPage({ section }: { section: SectionDef }) {
  return (
    <article>
      <PageHead kicker={section.group} title={section.title} subtitle={section.subtitle} />
      <div className="max-w-3xl px-6 pb-20 pt-2 sm:px-12 lg:px-16">
        <Blocks blocks={section.blocks} />
      </div>
    </article>
  );
}

export function StagePage({ stage }: { stage: StageDef }) {
  return (
    <article>
      <header className="border-b border-line px-6 pb-10 pt-12 sm:px-12 lg:px-16">
        <div className="rise flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono2 text-[60px] font-semibold leading-none text-accent sm:text-[72px]">
            {String(stage.num).padStart(2, "0")}
          </span>
          <span className="meta-label">
            {stage.timing}
            {stage.cost ? ` · ${stage.cost}` : ""}
          </span>
        </div>
        <h1 className="rise rise-1 mt-4 max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-[46px]">
          {stage.title}
        </h1>
        {/* мета-блок */}
        <div className="rise rise-2 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Мета", stage.meta.goal],
            ["Час", stage.meta.time],
            ["Результат", stage.meta.result],
            ["Ризик, якщо пропустити", stage.meta.risk],
          ].map(([k, v]) => (
            <div key={k} className="card-lift rounded-2xl bg-paper-deep p-5">
              <div className="font-mono2 text-[10px] uppercase tracking-[0.16em] text-ink-faint">{k}</div>
              <div className={`mt-1.5 text-[13.5px] font-semibold leading-snug ${k.startsWith("Ризик") ? "text-[hsl(var(--bad))]" : ""}`}>{v}</div>
            </div>
          ))}
        </div>
      </header>
      <div className="max-w-3xl px-6 pb-20 pt-2 sm:px-12 lg:px-16">
        {stage.plain && (
          <>
            <h3 className="mt-10 mb-4 text-[22px] font-bold tracking-[-0.01em] border-t-2 border-[hsl(var(--ink))] pt-4">
              Простими словами
            </h3>
            <p className="my-4 text-[16.5px] leading-[1.75] text-ink-soft">{stage.plain}</p>
          </>
        )}
        <Blocks blocks={stage.blocks} />
      </div>
    </article>
  );
}
