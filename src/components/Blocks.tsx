import type { Block } from "@/content/types";
import { resourceLinks } from "@/content/links";
import { Checklist } from "./Checklist";
import { Figure } from "./figures/Figures";
import { AlertTriangle, Info, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

/* ── активні посилання на джерела ─────────────────────── */
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const linkNames = Object.keys(resourceLinks).sort((a, b) => b.length - a.length).map(escapeRe);
const DOMAIN_RE_SRC = String.raw`(?:[\w-]+\.)+(?:com|ai|ua|io|net|org|bg)(?:\/[\w./-]*[\w/-])?`;
const DOMAIN_EXACT = new RegExp(`^${DOMAIN_RE_SRC}$`);
const LINK_RE = new RegExp(
  `(\\[Etsy\\]|\\[Дані\\]|\\[Практика\\]|(?<![\\w'ʼ])(?:${linkNames.join("|")})(?![\\w'ʼ])|(?<![\\w'ʼ/@.])${DOMAIN_RE_SRC}(?![\\w'ʼ]))`,
  "g"
);

function SrcLink({ name, href }: { name: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="src-link">
      {name}
    </a>
  );
}

function Marker({ text }: { text: string }) {
  // підсвічування маркерів джерел у тексті + активні посилання на ресурси й домени
  const parts = text.split(LINK_RE);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => {
        if (/^\[(Etsy|Дані|Практика)\]$/.test(p)) {
          return (
            <span key={i} className="marker-chip text-accent-deep border-[hsl(var(--accent))]/40 bg-accent-soft">
              {p}
            </span>
          );
        }
        if (resourceLinks[p]) return <SrcLink key={i} name={p} href={resourceLinks[p]} />;
        if (DOMAIN_EXACT.test(p)) return <SrcLink key={i} name={p} href={`https://${p}`} />;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/* посилання в кінці цитат: «… Блог · YouTube», «… Стаття», «… Кейс» */
function quoteRefLinks(source = ""): Record<string, string> {
  if (source.includes("Dylan Jahraus"))
    return { Блог: "https://dylanjahraus.com", YouTube: "https://www.youtube.com/@DylanJahraus" };
  if (source.includes("Starla Moore")) return { YouTube: "https://www.youtube.com/@StarlaMoore" };
  if (source.includes("Kate Hayes")) return { YouTube: "https://www.youtube.com/@KateHayes" };
  if (source.includes("Marmalead")) return { Стаття: "https://blog.marmalead.com" };
  if (source.includes("Growing Your Craft")) return { Стаття: "https://growingyourcraft.com/blog" };
  if (source.includes("Cynthia Treen")) return { Кейс: "https://www.etsy.com/seller-handbook" };
  return {};
}

function QuoteText({ text, source }: { text: string; source?: string }) {
  const m = text.match(/ (Блог · YouTube|YouTube|Стаття|Кейс)$/);
  if (!m || m.index === undefined) return <Marker text={text} />;
  const body = text.slice(0, m.index);
  const ref = m[1];
  const links = quoteRefLinks(source);
  return (
    <>
      <Marker text={body} />{" "}
      {ref === "Блог · YouTube" ? (
        <>
          {links["Блог"] ? <SrcLink name="Блог" href={links["Блог"]} /> : "Блог"}
          {" · "}
          {links["YouTube"] ? <SrcLink name="YouTube" href={links["YouTube"]} /> : "YouTube"}
        </>
      ) : links[ref] ? (
        <SrcLink name={ref} href={links[ref]} />
      ) : (
        ref
      )}
    </>
  );
}

function PromptBox({ title, text }: { title?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="my-6 rounded-lg border border-line bg-[hsl(var(--ink))] text-[#fff] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono2 text-[11px] uppercase tracking-[0.14em] text-white/60">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          {title ?? "Готовий запит"}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 font-mono2 text-[11px] text-white/70 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Скопійовано" : "Копіювати"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap px-4 py-4 font-mono2 text-[13px] leading-relaxed text-white/85">
        {text}
      </pre>
    </div>
  );
}

export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "lead":
      return <p className="my-6 text-[19px] leading-[1.6] font-medium text-[hsl(var(--ink))]"><Marker text={b.text} /></p>;
    case "p":
      return <p className="my-4 text-[16px] leading-[1.75] text-ink-soft"><Marker text={b.text} /></p>;
    case "h3":
      return (
        <h3 className="mt-12 mb-5 text-[22px] font-bold tracking-[-0.01em] border-t-2 border-[hsl(var(--ink))] pt-4">
          {b.text}
        </h3>
      );
    case "h4":
      return <h4 className="mt-8 mb-3 text-[16px] font-bold">{b.text}</h4>;
    case "table":
      return (
        <figure className="my-6 overflow-x-auto scroll-thin">
          <table className="w-full min-w-[520px] border-collapse text-[14px]">
            <thead>
              <tr>
                {b.headers.map((h, i) => (
                  <th key={i} className="border-b-2 border-[hsl(var(--ink))] pb-2 pr-4 text-left font-mono2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-dashed border-line last:border-b-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`py-2.5 pr-4 align-top leading-relaxed ${ci === 0 ? "font-medium" : "text-ink-soft"}`}>
                      <Marker text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {b.caption && <figcaption className="mt-2 font-mono2 text-[11px] text-ink-faint">{b.caption}</figcaption>}
        </figure>
      );
    case "list":
      return b.ordered ? (
        <ol className="my-5 space-y-0">
          {b.items.map((item, i) => (
            <li key={i} className="flex gap-4 border-b border-dashed border-line py-3 last:border-b-0">
              <span className="font-mono2 text-[13px] font-semibold text-accent pt-0.5 shrink-0 w-7">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] leading-relaxed text-ink-soft"><Marker text={item} /></span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-5 space-y-0">
          {b.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 border-b border-dashed border-line py-3 last:border-b-0">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-[15px] leading-relaxed text-ink-soft"><Marker text={item} /></span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div className="my-6 flex gap-3.5 rounded-lg bg-paper-deep px-4 py-4">
          <Info className="mt-0.5 h-4.5 w-4.5 h-5 w-5 shrink-0 text-ink-soft" />
          <div>
            {b.title && <p className="mb-1 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]">{b.title}</p>}
            <p className="text-[14.5px] leading-relaxed text-ink-soft"><Marker text={b.text} /></p>
          </div>
        </div>
      );
    case "warn":
      return (
        <div className="my-6 flex gap-3.5 rounded-lg border border-[hsl(var(--accent))]/50 bg-accent-soft px-4 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            {b.title && <p className="mb-1 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-deep">{b.title}</p>}
            <p className="text-[14.5px] leading-relaxed text-[hsl(var(--ink))]"><Marker text={b.text} /></p>
          </div>
        </div>
      );
    case "prompt":
      return <PromptBox title={b.title} text={b.text} />;
    case "quote":
      return (
        <blockquote className="my-6 border-l-[3px] border-[hsl(var(--accent))] pl-5 py-1">
          <p className="text-[16px] leading-[1.7] text-[hsl(var(--ink))]"><QuoteText text={b.text} source={b.source} /></p>
          {b.source && <footer className="mt-2 font-mono2 text-[12px] text-ink-faint">— <Marker text={b.source} /></footer>}
        </blockquote>
      );
    case "figure":
      return <Figure id={b.id} caption={b.caption} />;
    case "checklist":
      return <Checklist id={b.id} title={b.title} items={b.items} />;
    case "divider":
      return <hr className="my-10 border-t border-line" />;
    default:
      return null;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  );
}
