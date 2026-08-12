import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CursorGlow } from "@/components/CursorGlow";
import { HomePage } from "@/pages/Home";
import { SectionPage, StagePage } from "@/pages/SectionPage";
import { GlossaryPage } from "@/pages/GlossaryPage";
import { CalculatorPage } from "@/pages/Calculator";
import { findContent, navItems } from "@/content";
import { useHashRoute, useVisited } from "@/hooks/useProgress";

function Pager({ route, onNav }: { route: string; onNav: (id: string) => void }) {
  const idx = navItems.findIndex((i) => i.id === route);
  if (idx < 0) return null;
  const prev = navItems[idx - 1];
  const next = navItems[idx + 1];
  return (
    <div className="flex items-stretch justify-between gap-3 border-t border-line px-6 py-6 sm:px-12 lg:px-16">
      {prev ? (
        <button onClick={() => onNav(prev.id)} className="group flex items-center gap-3 text-left">
          <ArrowLeft className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:-translate-x-0.5" />
          <span>
            <span className="block font-mono2 text-[10px] uppercase tracking-[0.16em] text-ink-faint">Назад</span>
            <span className="text-[13.5px] font-semibold">{prev.label}</span>
          </span>
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button onClick={() => onNav(next.id)} className="group flex items-center gap-3 text-right">
          <span>
            <span className="block font-mono2 text-[10px] uppercase tracking-[0.16em] text-ink-faint">Далі</span>
            <span className="text-[13.5px] font-semibold">{next.label}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

export default function App() {
  const [route, nav] = useHashRoute();
  const { visited, mark } = useVisited();

  useEffect(() => {
    mark(route);
  }, [route, mark]);

  const content = findContent(route);

  return (
    <Layout route={route} visited={visited} onNav={nav}>
      <CursorGlow />
      {content.kind === "home" && <HomePage onNav={nav} />}
      {content.kind === "section" && content.section && <SectionPage section={content.section} />}
      {content.kind === "stage" && content.stage && <StagePage stage={content.stage} />}
      {content.kind === "glossary" && <GlossaryPage />}
      {content.kind === "calculator" && <CalculatorPage />}
      {route !== "home" && <Pager route={route} onNav={nav} />}
      <footer className="border-t border-line px-6 py-8 sm:px-12 lg:px-16">
        <p className="max-w-2xl font-mono2 text-[11px] leading-relaxed text-ink-faint">
          Etsy® — торговельна марка Etsy, Inc. Матеріал не є офіційним виданням Etsy. Редакція 12 серпня 2026 року ·
          версія 1.0. Дані чеклістів, трекера й журналу зберігаються лише у вашому браузері.
        </p>
      </footer>
    </Layout>
  );
}
