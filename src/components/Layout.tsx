import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navGroups, navItems } from "@/content";

export function Layout({
  route,
  visited,
  onNav,
  children,
}: {
  route: string;
  visited: string[];
  onNav: (id: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleNav = (id: string) => {
    setOpen(false);
    onNav(id);
  };

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (
    <nav className="flex h-full flex-col">
      <button onClick={() => handleNav("home")} className="border-b border-line px-6 pb-5 pt-6 text-left">
        <div className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-accent">Etsy</div>
        <div className="mt-2 text-[14.5px] font-semibold leading-tight tracking-[-0.015em]">
          Від нуля до масштабування
        </div>
        <div className="mt-1.5 font-mono2 text-[10.5px] text-ink-faint">посібник для продавця з України · ред. 12.08.2026</div>
      </button>
      <div className="scroll-thin flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((g) => (
          <div key={g} className="mb-5">
            <div className="px-3 pb-2 font-mono2 text-[10px] uppercase tracking-[0.2em] text-ink-faint">{g}</div>
            {navItems
              .filter((i) => i.group === g)
              .map((i) => {
                const active = route === i.id;
                const seen = visited.includes(i.id);
                return (
                  <button
                    key={i.id}
                    onClick={() => handleNav(i.id)}
                    className={`group flex w-full items-center gap-2.5 rounded-full px-3.5 py-[8px] text-left text-[13.5px] leading-snug transition-all duration-200 ${
                      active ? "bg-[hsl(var(--ink))] font-semibold text-white" : "text-ink-soft hover:bg-paper-deep hover:text-[hsl(var(--ink))]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                        active ? "dot-active bg-accent" : seen ? "bg-accent" : "bg-[hsl(var(--line))]"
                      }`}
                    />
                    <span className="flex-1">{i.label}</span>
                    {i.kind === "calculator" && !active && <ArrowUpRight className="h-3.5 w-3.5 text-ink-faint" />}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
      <div className="border-t border-line px-6 py-4 font-mono2 text-[10.5px] leading-relaxed text-ink-faint">
        103 джерела · 10 етапів · 12 схем
        <br />
        Торговельна марка Etsy належить Etsy, Inc.
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen">
      <div className="readbar" style={{ width: `${progress}%` }} />

      {/* mobile top bar */}
      <div className="glass sticky top-0 z-50 flex items-center justify-between border-b border-line/60 px-4 py-3 lg:hidden">
        <button onClick={() => handleNav("home")} className="flex items-baseline gap-2">
          <span className="text-[20px] font-extrabold tracking-[-0.03em] text-accent">Etsy</span>
          <span className="text-[12.5px] font-semibold text-ink-soft">посібник</span>
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 text-[hsl(var(--ink))] transition-colors hover:text-accent"
          aria-label="Меню"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-[340px] border-l border-line bg-white pt-16 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {nav}
        </div>
      </div>

      <div className="flex">
        {/* desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 border-r border-line lg:block">{nav}</aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
