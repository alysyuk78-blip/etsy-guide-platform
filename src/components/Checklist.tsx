import { Check } from "lucide-react";
import { useLocalState } from "@/hooks/useProgress";

export function Checklist({ id, title, items }: { id: string; title: string; items: string[] }) {
  const [done, setDone] = useLocalState<string[]>(`etsy:check:${id}`, []);
  const toggle = (i: number) =>
    setDone((prev) => {
      const k = String(i);
      return prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k];
    });
  const pct = items.length ? Math.round((done.length / items.length) * 100) : 0;

  return (
    <section className="my-10">
      <div className="flex items-baseline justify-between gap-4 border-t-2 border-[hsl(var(--ink))] pt-4">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <span className="font-mono2 text-xs text-ink-faint">
          {done.length}/{items.length} · {pct}%
        </span>
      </div>
      <div className="mt-1 h-1 w-full bg-paper-deep">
        <div className="h-1 bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4">
        {items.map((item, i) => {
          const checked = done.includes(String(i));
          return (
            <li key={i} className="check-item dashed-sep first:border-t-0">
              <label className="flex cursor-pointer items-start gap-3 py-3 group">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggle(i)}
                />
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                    checked ? "border-[hsl(var(--accent))] bg-accent" : "border-[hsl(var(--ink-faint))] group-hover:border-[hsl(var(--accent))]"
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </span>
                <span className="text-[15px] leading-relaxed">{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 font-mono2 text-[11px] text-ink-faint">
        Позначки зберігаються у вашому браузері
      </p>
    </section>
  );
}
