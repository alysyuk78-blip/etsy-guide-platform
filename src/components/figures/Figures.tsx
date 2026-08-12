import { ArrowRight, X, Check } from "lucide-react";

function Shell({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="my-10 rounded-xl border border-line bg-white/60 p-5 sm:p-7">
      {children}
      <figcaption className="mt-5 border-t border-dashed border-line pt-3 font-mono2 text-[11px] text-ink-faint">
        {caption}
      </figcaption>
    </figure>
  );
}

function FigLabel({ children }: { children: React.ReactNode }) {
  return <p className="meta-label mb-4">{children}</p>;
}

/* ── Рис. 1: Карта шляху ─────────────────────────────── */
const pathStages = [
  { n: "0", name: "Рішення", time: "3–5 днів", out: "Товар законний" },
  { n: "1", name: "Ніша", time: "5–7 днів", out: "Список 15–20 товарів" },
  { n: "2", name: "Фінанси", time: "7–10 днів", out: "ФОП + Payoneer" },
  { n: "3", name: "Магазин", time: "1–2 дні", out: "Магазин оформлено" },
  { n: "4", name: "Фото", time: "7–10 днів", out: "8–10 фото + відео" },
  { n: "5", name: "Тексти", time: "5–7 днів", out: "Лістинги написані" },
  { n: "6", name: "Доставка", time: "3–5 днів", out: "Ціни з митом" },
  { n: "7", name: "Запуск", time: "4 тижні", out: "Перший продаж" },
  { n: "8", name: "Реклама", time: "місяць 3–4", out: "Star Seller" },
  { n: "9", name: "Масштаб", time: "місяць 5+", out: "Делегування · 2-й канал" },
];

function Fig1() {
  return (
    <Shell caption="Рис. 1. Шлях від ідеї до масштабування: десять етапів і строки">
      <FigLabel>Шлях від ідеї до масштабування</FigLabel>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-[hsl(var(--line))] sm:grid-cols-5">
        {pathStages.map((s) => (
          <div key={s.n} className={`p-4 ${s.n === "7" ? "bg-accent text-white" : "bg-[hsl(var(--paper))]"}`}>
            <div className={`font-mono2 text-[22px] font-semibold leading-none ${s.n === "7" ? "text-white" : "text-accent"}`}>
              {s.n}
            </div>
            <div className="mt-2 text-[14px] font-bold uppercase tracking-wide">{s.name}</div>
            <div className={`mt-1 font-mono2 text-[11px] ${s.n === "7" ? "text-white/80" : "text-ink-faint"}`}>{s.time}</div>
            <div className={`mt-3 border-t border-dashed pt-2 text-[12px] leading-snug ${s.n === "7" ? "border-white/40 text-white/90" : "border-line text-ink-soft"}`}>
              {s.out}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-ink-soft">
        До першого продажу: <b>8–12 тижнів</b> вечорами · <b>4–6 тижнів</b> при повній зайнятості
      </p>
    </Shell>
  );
}

/* ── Рис. 2: Дерево рішень ───────────────────────────── */
const designBranches = [
  { from: "Придумав сам", verdict: "Можна", ok: true },
  { from: "Замовив у дизайнера", verdict: "Можна + договір", ok: true },
  { from: "Купив шаблон на маркетплейсі", verdict: "Не можна, навіть з ліцензією", ok: false },
  { from: "Перепродаю готовий товар", verdict: "Не можна", ok: false },
  { from: "Згенерував ШІ за своїм задумом", verdict: "Можна + розкриття", ok: true },
];

function Fig2() {
  return (
    <Shell caption="Рис. 2. Дерево рішень: чи можна продавати ваш товар на Etsy">
      <FigLabel>Перевірка перед стартом: чий це дизайн?</FigLabel>
      <div className="rounded-lg bg-[hsl(var(--ink))] px-5 py-4 text-center text-[15px] font-semibold text-[#fff]">
        Звідки взявся дизайн товару?
      </div>
      <div className="mx-auto h-5 w-px bg-[hsl(var(--ink))]" />
      <div className="space-y-2">
        {designBranches.map((b) => (
          <div key={b.from} className="flex flex-col gap-2 rounded-lg border border-line bg-[hsl(var(--paper))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[14px] font-medium">{b.from}</span>
            <span
              className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-mono2 text-[11.5px] font-semibold ${
                b.ok ? "bg-[hsl(var(--good))]/12 text-[hsl(var(--good))]" : "bg-[hsl(var(--bad))]/10 text-[hsl(var(--bad))]"
              }`}
            >
              {b.ok ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />}
              {b.verdict}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-[hsl(var(--accent))]/50 bg-accent-soft px-4 py-3 text-[13.5px] leading-relaxed">
        <b className="text-accent-deep">Комерційна ліцензія ≠ дозвіл Etsy.</b> Ліцензія вирішує питання авторського
        права. Правило Etsy вимагає, щоб дизайн був вашою творчою роботою.
      </div>
    </Shell>
  );
}

/* ── Рис. 3: Куди йдуть гроші ────────────────────────── */
const moneyFlow = [
  { label: "Виручка", v: 52.0, kind: "base" as const },
  { label: "Transaction 6,5%", v: -3.38, kind: "fee" as const },
  { label: "Обробка 6% + $0,30", v: -3.42, kind: "fee" as const },
  { label: "Listing fee", v: -0.2, kind: "fee" as const },
  { label: "Собівартість", v: -9.0, kind: "cost" as const },
  { label: "Пакування", v: -1.5, kind: "cost" as const },
  { label: "Доставка", v: -14.0, kind: "cost" as const },
  { label: "Прибуток", v: 20.5, kind: "profit" as const },
];

function Fig3() {
  const max = 52;
  return (
    <Shell caption="Рис. 3. Куди йдуть гроші з одного замовлення на $52">
      <FigLabel>Куди йдуть гроші з одного замовлення · товар $40 + доставка $12 = $52, покупець зі США</FigLabel>
      <div className="space-y-1.5">
        {moneyFlow.map((m) => {
          const w = Math.max(4, (Math.abs(m.v) / max) * 100);
          const color =
            m.kind === "base"
              ? "bg-[hsl(var(--ink))] text-[#fff]"
              : m.kind === "profit"
                ? "bg-accent text-white"
                : m.kind === "fee"
                  ? "bg-[hsl(var(--accent))]/25 text-accent-deep"
                  : "bg-paper-deep text-ink-soft";
          return (
            <div key={m.label} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-right font-mono2 text-[11px] text-ink-faint sm:w-44">{m.label}</span>
              <div className="flex-1">
                <div className={`flex h-8 items-center justify-between rounded px-2.5 font-mono2 text-[12px] font-semibold ${color}`} style={{ width: `${w}%` }}>
                  <span className="whitespace-nowrap">
                    {m.v > 0 && m.kind !== "base" ? "" : ""}
                    {m.v > 0 ? `$${m.v.toFixed(2)}` : `−$${Math.abs(m.v).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-paper-deep px-4 py-3 text-[13px] leading-snug">
          <span className="font-mono2 text-[11px] uppercase tracking-wider text-ink-faint">Комісії Etsy за прайсом</span>
          <div className="mt-1 font-semibold">$7,00 — 13,5% виручки</div>
        </div>
        <div className="rounded-lg bg-accent-soft px-4 py-3 text-[13px] leading-snug">
          <span className="font-mono2 text-[11px] uppercase tracking-wider text-accent-deep">Якщо замовлення з Offsite Ads (−15%)</span>
          <div className="mt-1 font-semibold text-accent-deep">Прибуток падає до $12,70</div>
        </div>
      </div>
    </Shell>
  );
}

/* ── Рис. 4: Шлях грошей ─────────────────────────────── */
const moneyChain = [
  { name: "Покупець", sub: "платить карткою" },
  { name: "Etsy", sub: "утримує комісії" },
  { name: "Payoneer", sub: "долар. виплати щопонеділка" },
  { name: "Банк ФОП", sub: "підприємницький рахунок" },
  { name: "Ви", sub: "після сплати єдиного податку" },
];

function Fig4() {
  return (
    <Shell caption="Рис. 4. Шлях грошей від покупця до вашого рахунку">
      <FigLabel>Як гроші доходять до вас</FigLabel>
      <div className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center">
        {moneyChain.map((n, i) => (
          <div key={n.name} className="flex flex-1 items-center gap-1">
            <div className={`flex-1 rounded-lg border px-3 py-3 text-center ${i === 4 ? "border-[hsl(var(--accent))] bg-accent-soft" : "border-line bg-[hsl(var(--paper))]"}`}>
              <div className="text-[14px] font-bold">{n.name}</div>
              <div className="mt-0.5 font-mono2 text-[10.5px] leading-snug text-ink-faint">{n.sub}</div>
            </div>
            {i < moneyChain.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-accent sm:rotate-0" />}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent px-3 py-1 font-mono2 text-[12px] font-semibold text-white">seller fees — за вашим сценарієм</span>
        <span className="font-mono2 text-[11px] text-ink-faint">25,9% corporate take rate ≠ ваша комісія</span>
      </div>
      <div className="mt-4 rounded-lg border border-[hsl(var(--bad))]/30 bg-[hsl(var(--bad))]/5 px-4 py-3">
        <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--bad))]">
          Дві податкові зони ризику
        </p>
        <ol className="mt-2 space-y-1 text-[13.5px] text-ink-soft">
          <li>1. Переказ на особистий рахунок замість підприємницького</li>
          <li>2. Залишок на Payoneer наприкінці звітного періоду без власної ІПК</li>
        </ol>
      </div>
    </Shell>
  );
}

/* ── Рис. 5: Зйомка вдома ────────────────────────────── */
function Fig5() {
  return (
    <Shell caption="Рис. 5. Як поставити зйомку вдома: вікно, фон дугою, телефон">
      <FigLabel>Як поставити зйомку вдома · все, що потрібно: вікно, стіл, аркуш білого ватману і телефон</FigLabel>
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <svg viewBox="0 0 420 300" className="w-full rounded-lg bg-[hsl(var(--paper))]" role="img" aria-label="Схема домашньої фотозйомки">
          {/* вікно */}
          <g stroke="#1C1917" strokeWidth="2" fill="none">
            <rect x="24" y="30" width="110" height="150" rx="4" fill="#fff" />
            <line x1="79" y1="30" x2="79" y2="180" />
            <line x1="24" y1="105" x2="134" y2="105" />
          </g>
          {/* промені */}
          <g stroke="#F1641E" strokeWidth="2" strokeDasharray="6 6">
            <line x1="140" y1="55" x2="235" y2="95" />
            <line x1="140" y1="105" x2="240" y2="150" />
            <line x1="140" y1="160" x2="230" y2="200" />
          </g>
          {/* фон дугою */}
          <path d="M 250 60 Q 320 60 320 150 L 320 235" stroke="#1C1917" strokeWidth="2" fill="none" />
          <path d="M 258 70 Q 312 72 312 150 L 312 235" stroke="#B9AE9C" strokeWidth="1.4" fill="none" strokeDasharray="3 5" />
          {/* стіл */}
          <line x1="205" y1="235" x2="405" y2="235" stroke="#1C1917" strokeWidth="2.5" />
          <line x1="225" y1="235" x2="218" y2="285" stroke="#1C1917" strokeWidth="2.5" />
          <line x1="385" y1="235" x2="392" y2="285" stroke="#1C1917" strokeWidth="2.5" />
          {/* товар — ваза */}
          <g stroke="#F1641E" strokeWidth="2.2" fill="none">
            <path d="M 288 235 L 291 205 Q 292 196 285 192 Q 278 187 283 178 L 288 168 L 296 168 L 301 178 Q 306 187 299 192 Q 292 196 293 205 L 296 235 Z" fill="#FBE9DD" />
          </g>
          {/* телефон на штативі */}
          <g stroke="#1C1917" strokeWidth="2" fill="#fff">
            <rect x="170" y="185" width="26" height="44" rx="5" />
            <circle cx="183" cy="196" r="4" fill="none" />
          </g>
          <g stroke="#1C1917" strokeWidth="2" fill="none">
            <line x1="183" y1="229" x2="183" y2="250" />
            <line x1="183" y1="250" x2="165" y2="285" />
            <line x1="183" y1="250" x2="201" y2="285" />
            <line x1="183" y1="250" x2="183" y2="285" />
          </g>
          <g fontFamily="IBM Plex Mono, monospace" fontSize="10.5" fill="#57534E">
            <text x="34" y="22">ВІКНО · розсіяне світло</text>
            <text x="228" y="50">білий ватман дугою</text>
            <text x="255" y="295">ТОВАР</text>
            <text x="78" y="292">ТЕЛЕФОН на рівні товару</text>
          </g>
        </svg>
        <div>
          <p className="meta-label mb-3">Правила</p>
          <ul className="space-y-2.5 text-[13.5px] leading-snug text-ink-soft">
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Знімайте вранці або в похмурий день</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Прямі промені = різкі тіні = брак</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Аркуш білого паперу зігнутий дугою (без кута між стіною і столом) як відбивач тіней</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Не користуйтесь зумом — підходьте ближче</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Знімайте на рівні очей товару</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Залишайте відступ навколо предмета</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Обробка в телефоні: експозиція, тіні</li>
            <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Колір на фото = колір у реальності</li>
          </ul>
          <p className="mt-4 border-t border-dashed border-line pt-3 text-[12.5px] text-ink-faint">
            Cynthia Treen, 8000+ продажів на Etsy: знімає на iPhone, а не на дзеркалку. Софтбокс ~$125 знімає проблему
            зернистих кадрів у приміщенні.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ── Рис. 6: Сім типів кадрів ────────────────────────── */
const shotTypes = [
  { n: 1, name: "Studio", desc: "чистий фон", role: "мініатюра у видачі" },
  { n: 2, name: "Lifestyle", desc: "в інтер’єрі", role: "дає уявити у себе вдома" },
  { n: 3, name: "Scale", desc: "з масштабом", role: "знімає питання про розмір" },
  { n: 4, name: "Detail", desc: "макро", role: "доводить якість" },
  { n: 5, name: "Group", desc: "усі варіанти", role: "показує вибір" },
  { n: 6, name: "Packaging", desc: "упаковка", role: "продає як подарунок" },
  { n: 7, name: "Process", desc: "виготовлення", role: "доказ ручної роботи" },
];

function Fig6() {
  return (
    <Shell caption="Рис. 6. Сім типів кадрів і межа дозволеного для AI">
      <FigLabel>Сім обов’язкових типів кадрів · офіційна рекомендація Etsy Seller Handbook · використовуйте всі 10 слотів на лістинг</FigLabel>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-[hsl(var(--line))] sm:grid-cols-4 lg:grid-cols-7">
        {shotTypes.map((s) => (
          <div key={s.n} className="bg-[hsl(var(--paper))] p-3.5">
            <div className="font-mono2 text-[18px] font-semibold text-accent">{s.n}</div>
            <div className="mt-1.5 text-[13px] font-bold">{s.name}</div>
            <div className="font-mono2 text-[10.5px] text-ink-faint">{s.desc}</div>
            <div className="mt-2.5 border-t border-dashed border-line pt-2 text-[11.5px] leading-snug text-ink-soft">{s.role}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[hsl(var(--good))]/35 bg-[hsl(var(--good))]/5 px-4 py-3.5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--good))]">Що може AI</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
            <li>· Прибрати або замінити фон справжнього фото</li>
            <li>· Створити сцену навколо реального товару</li>
            <li>· Прибрати шум, підняти роздільність</li>
            <li>· Зробити банер та інфографіку з розмірами</li>
          </ul>
        </div>
        <div className="rounded-lg border border-[hsl(var(--bad))]/35 bg-[hsl(var(--bad))]/5 px-4 py-3.5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--bad))]">Що AI робити не можна</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
            <li>· Показувати згенероване зображення замість фото</li>
            <li>· Замінювати товар на «покращену» версію</li>
            <li>· Ставити мокап замість знімка готового виробу</li>
            <li>· Змінювати колір і форму реального товару</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}

/* ── Рис. 7: Анатомія лістинга ───────────────────────── */
function Fig7() {
  return (
    <Shell caption="Рис. 7. Анатомія лістинга: що і навіщо в кожному полі">
      <FigLabel>Анатомія лістинга, який знаходять</FigLabel>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* макет лістинга */}
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="flex h-44 items-center justify-center bg-paper-deep">
            <div className="text-center">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-dashed border-[hsl(var(--ink-faint))]" />
              <span className="font-mono2 text-[10.5px] uppercase tracking-wider text-ink-faint">Фото 1 · горизонтальне ≥ 2000 px</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[14.5px] font-semibold leading-snug">
                Personalized Birth Flower Ring, Sterling Silver, Gift for Mom
              </p>
              <span className="shrink-0 font-mono2 text-[15px] font-semibold">$48.00</span>
            </div>
            <div className="mt-2 flex items-center gap-2 font-mono2 text-[11px] text-ink-faint">
              <span className="text-accent">★★★★★</span>
              <span>(24)</span>
              <span className="rounded-full bg-[hsl(var(--good))]/12 px-2 py-0.5 font-semibold text-[hsl(var(--good))]">FREE shipping</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["birth flower ring", "sterling silver", "gift for mom", "+10 тегів"].map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono2 text-[10.5px] text-ink-soft">{t}</span>
              ))}
            </div>
            <p className="mt-3 border-t border-dashed border-line pt-3 font-mono2 text-[11px] text-ink-faint">
              Опис · Характеристики · Терміни · Догляд
            </p>
          </div>
        </div>
        {/* анотації */}
        <div className="space-y-4">
          {[
            {
              k: "Заголовок",
              v: "Etsy радить ясний заголовок, часто менш ніж із 15 слів: назва товару й ключові об’єктивні характеристики. Початок заголовка важливий для читабельності, але «40 символів» не є правилом ранжування.",
            },
            {
              k: "Фото",
              v: "Якісне перше фото допомагає клікам і конверсії. Розмір від 2000 px та безпечні поля — практична рекомендація для чіткого відображення й кадрування.",
            },
            {
              k: "13 тегів",
              v: "Використовуйте релевантні багатослівні теги. Розподіл за товаром, матеріалом, приводом і стилем — стартова гіпотеза для тесту, не формула Etsy.",
            },
            {
              k: "Атрибути + опис",
              v: "Заповнюйте всі правдиві релевантні атрибути й точний опис. Пошук оцінює лістинг цілісно; 80% — евристика внутрішнього аудиту, не поріг Etsy.",
            },
          ].map((a) => (
            <div key={a.k} className="rounded-lg bg-[hsl(var(--paper))] px-4 py-3.5">
              <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{a.k}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{a.v}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ── Рис. 8: Діагностика ─────────────────────────────── */
const funnel = [
  {
    level: "Покази",
    en: "Impressions",
    symptom: "Мало показів",
    diag: "Проблема в SEO",
    fix: "Перевірити заголовок і теги, заповнити всі релевантні атрибути",
    w: "100%",
  },
  {
    level: "Кліки",
    en: "Clicks",
    symptom: "Покази є, кліків немає",
    diag: "Проблема у фото або ціні",
    fix: "Перезняти перше фото, перевірити ціну проти топу",
    w: "68%",
  },
  {
    level: "Продажі",
    en: "Orders",
    symptom: "Кліки є, продажів немає",
    diag: "Проблема в описі або доставці",
    fix: "Переписати опис, перевірити вартість доставки",
    w: "36%",
  },
];

function Fig8() {
  return (
    <Shell caption="Рис. 8. Діагностика за трьома цифрами зі статистики магазину">
      <FigLabel>Діагностика: що саме зламалося · відкрийте Shop Manager → Stats раз на тиждень — три цифри дають точний діагноз</FigLabel>
      <div className="space-y-3">
        {funnel.map((f) => (
          <div key={f.level} className="grid gap-0 overflow-hidden rounded-lg border border-line sm:grid-cols-[200px_1fr]">
            <div className="bg-[hsl(var(--ink))] px-4 py-3.5 text-[#fff]">
              <div className="h-1.5 rounded-full bg-accent" style={{ width: f.w }} />
              <div className="mt-2.5 text-[15px] font-bold uppercase tracking-wide">{f.level}</div>
              <div className="font-mono2 text-[10.5px] text-white/50">{f.en}</div>
            </div>
            <div className="grid gap-2 bg-[hsl(var(--paper))] px-4 py-3.5 sm:grid-cols-3 sm:gap-4">
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-wider text-ink-faint">Симптом</p>
                <p className="mt-0.5 text-[13.5px] font-semibold">{f.symptom}</p>
              </div>
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-wider text-ink-faint">Діагноз</p>
                <p className="mt-0.5 text-[13.5px] text-accent-deep font-semibold">{f.diag}</p>
              </div>
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-wider text-ink-faint">Лікування</p>
                <p className="mt-0.5 text-[13.5px] text-ink-soft">{f.fix}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-accent-soft px-4 py-3 text-[13.5px] text-accent-deep">
        <b>Змінюйте по одному елементу на тиждень.</b> Якщо міняти все одразу — ви ніколи не дізнаєтесь, що саме спрацювало.
      </p>
    </Shell>
  );
}

/* ── Рис. 9: Два рівні вимог ─────────────────────────── */
function Fig9() {
  const rows: [string, string, string][] = [
    ["Відповідь на повідомлення", "80% / 48 год", "95% / 24 год"],
    ["Відправка вчасно", "80%", "95% · з трекінгом"],
    ["Кейси з поверненням", "до 300 замовлень — макс. 3", "—"],
    ["Рейтинг", "≤4 оцінок ≤3 зірок", "середній 4,8+"],
    ["Замовлень і продажів за 3 міс", "—", "5 шт / $300"],
  ];
  return (
    <Shell caption="Рис. 9. Два рівні вимог: мінімум і Star Seller">
      <FigLabel>Два рівні вимог до сервісу</FigLabel>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-[hsl(var(--paper))] p-5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]">Мінімум — інакше санкції</p>
          <p className="mt-1 font-mono2 text-[10.5px] text-ink-faint">Customer Service Standards</p>
          <ul className="mt-4 space-y-2.5">
            {rows.map((r) => (
              <li key={r[0]} className="flex items-baseline justify-between gap-3 border-b border-dashed border-line pb-2 text-[13px] last:border-b-0">
                <span className="text-ink-soft">{r[0]}</span>
                <span className="text-right font-mono2 font-semibold">{r[1]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded bg-[hsl(var(--bad))]/8 px-3 py-2 text-[12.5px] text-[hsl(var(--bad))]">
            Наслідки: падіння в пошуку, втрата Purchase Protection, аж до блокування магазину
          </p>
        </div>
        <div className="rounded-lg border border-[hsl(var(--accent))]/50 bg-accent-soft p-5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-deep">Star Seller — значок надійності</p>
          <p className="mt-1 font-mono2 text-[10.5px] text-accent-deep/70">Оцінка 1 числа щомісяця за 3 місяці</p>
          <ul className="mt-4 space-y-2.5">
            {rows.map((r) => (
              <li key={r[0]} className="flex items-baseline justify-between gap-3 border-b border-dashed border-[hsl(var(--accent))]/30 pb-2 text-[13px] last:border-b-0">
                <span className="text-ink-soft">{r[0]}</span>
                <span className="text-right font-mono2 font-semibold text-accent-deep">{r[2]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded bg-white/60 px-3 py-2 text-[12.5px] text-ink-soft">
            Значок не впливає на ранжування напряму, але метрики, за якими його дають, — впливають
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ── Рис. 10: AI за ролями ───────────────────────────── */
const aiRoles = [
  { name: "Тексти", what: "описи, заголовки, теги, відповіді, переклад", tools: "Claude · ChatGPT · Gemini · DeepL" },
  { name: "Зображення", what: "банери, інфографіка, оригінальні дизайни для друку", tools: "GPT Image 2 · Nano Banana · Reve" },
  { name: "Обробка фото", what: "фон, сцена, шум, роздільність справжнього знімка", tools: "Photoroom · Pebblely · Flair.ai · Upscayl" },
  { name: "Мокапи", what: "POD, футболки, патерни, оформлення", tools: "Dynamic Mockups · Placeit · Canva · Kittl" },
  { name: "Etsy-сервіси", what: "ключі, аудит, масове редагування, оцінка конкурентів", tools: "eRank · EverBee · Alura · Vela" },
  { name: "Вбудований AI", what: "заголовки, атрибути, повідомлення, пояснення статистики", tools: "Shop Manager · безкоштовно" },
];

function Fig10() {
  return (
    <Shell caption="Рис. 10. Шість ролей AI у роботі магазину і межа дозволеного">
      <FigLabel>AI за ролями: що кому доручати</FigLabel>
      <div className="grid gap-px overflow-hidden rounded-lg bg-[hsl(var(--line))] sm:grid-cols-2 lg:grid-cols-3">
        {aiRoles.map((r, i) => (
          <div key={r.name} className="bg-[hsl(var(--paper))] p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono2 text-[13px] font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[14.5px] font-bold">{r.name}</span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-snug text-ink-soft">{r.what}</p>
            <p className="mt-2.5 border-t border-dashed border-line pt-2 font-mono2 text-[11px] text-ink-faint">{r.tools}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-[hsl(var(--ink))] px-4 py-3.5 text-[#fff]">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Стартовий набір — $0</p>
          <p className="mt-1.5 text-[13.5px] leading-snug">
            Одна мовна модель + eRank + Canva + Photoroom + вбудовані інструменти Etsy
          </p>
        </div>
        <div className="rounded-lg border-2 border-[hsl(var(--bad))] bg-[hsl(var(--bad))]/5 px-4 py-3.5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--bad))]">Червона лінія</p>
          <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
            Використання ШІ в товарі — розкривати в описі. Фото товару — тільки справжні знімки.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ── Рис. 11: Два пошуки ─────────────────────────────── */
function Fig11() {
  return (
    <Shell caption="Рис. 11. Класичний пошук проти розмовного AI-пошуку">
      <FigLabel>Два способи сформулювати потребу · в обох випадках потрібні повні й правдиві дані лістинга</FigLabel>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-[hsl(var(--paper))] p-5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Класичний пошук</p>
          <div className="mt-3 rounded-md border border-line bg-white px-3.5 py-2.5 font-mono2 text-[13px]">
            silver ring for mom <span className="text-accent">⌕</span>
          </div>
          <ul className="mt-4 space-y-2 text-[13.5px] text-ink-soft">
            <li>Враховує ключові слова та релевантність у всьому лістингу</li>
            <li>Заголовок, теги й атрибути допомагають зіставленню</li>
            <li>Кліки, конверсія та сервіс також впливають на результат</li>
          </ul>
        </div>
        <div className="rounded-lg border border-[hsl(var(--accent))]/50 bg-accent-soft p-5">
          <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-deep">Розмовний AI-пошук</p>
          <div className="mt-3 rounded-md border border-[hsl(var(--accent))]/40 bg-white px-3.5 py-2.5 font-mono2 text-[13px] leading-snug">
            <span className="text-accent font-semibold">@Etsy</span> подарунок мамі до $100, вона любить садівництво
          </div>
          <ul className="mt-4 space-y-2 text-[13.5px] text-ink-soft">
            <li>Інтерпретує природний опис потреби покупця</li>
            <li>Повні атрибути й опис допомагають зрозуміти товар</li>
            <li>Немає підтвердженого Etsy порогу заповненості атрибутів</li>
          </ul>
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-[hsl(var(--ink))] px-4 py-3 text-[13.5px] leading-snug text-[#fff]">
        <b className="text-accent">Що робити зараз:</b> заповнити всі релевантні атрибути, зберегти ясний заголовок,
        точний опис і релевантні теги; оцінювати результат за власною аналітикою.
      </p>
    </Shell>
  );
}

/* ── Рис. 12: Календар 12 тижнів ─────────────────────── */
const gantt: { name: string; from: number; to: number; pub?: boolean }[] = [
  { name: "Ідея і перевірка законності", from: 1, to: 1 },
  { name: "Ніша й економіка", from: 2, to: 2 },
  { name: "ФОП, банк, Payoneer", from: 2, to: 3 },
  { name: "Створення магазину", from: 3, to: 3 },
  { name: "Фотозйомка", from: 3, to: 4 },
  { name: "Тексти й SEO", from: 4, to: 4 },
  { name: "Доставка й мито", from: 4, to: 5 },
  { name: "Публікація", from: 5, to: 5, pub: true },
  { name: "Перші продажі, спостереження", from: 6, to: 8 },
  { name: "Оптимізація, перша реклама", from: 9, to: 12 },
];

function Fig12() {
  return (
    <Shell caption="Рис. 12. Календар перших 12 тижнів: що з чим можна суміщати">
      <FigLabel>Календар перших 12 тижнів</FigLabel>
      <div className="overflow-x-auto scroll-thin">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[180px_repeat(12,1fr)] gap-x-1">
            <div />
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="pb-2 text-center font-mono2 text-[10px] text-ink-faint">
                Т{i + 1}
              </div>
            ))}
            {gantt.map((g) => (
              <div key={g.name} className="contents">
                <div className="flex items-center border-t border-dashed border-line py-1.5 pr-3 text-[12px] leading-tight text-ink-soft">
                  {g.name}
                </div>
                {Array.from({ length: 12 }, (_, i) => {
                  const wk = i + 1;
                  const on = wk >= g.from && wk <= g.to;
                  return (
                    <div key={i} className="flex items-center border-t border-dashed border-line py-1.5">
                      <div
                        className={`h-5 w-full rounded ${
                          on ? (g.pub ? "bg-accent" : "bg-[hsl(var(--ink))]/80") : "bg-transparent"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
        Смуги, що перекриваються, — це паралельна робота. Поки Payoneer на верифікації, знімайте фото; поки чекаєте
        перший продаж, пишіть нові лістинги.
      </p>
    </Shell>
  );
}

/* ── dispatcher ──────────────────────────────────────── */
const map: Record<string, () => React.ReactNode> = {
  fig1: Fig1,
  fig2: Fig2,
  fig3: Fig3,
  fig4: Fig4,
  fig5: Fig5,
  fig6: Fig6,
  fig7: Fig7,
  fig8: Fig8,
  fig9: Fig9,
  fig10: Fig10,
  fig11: Fig11,
  fig12: Fig12,
};

export function Figure({ id, caption }: { id: string; caption: string }) {
  const F = map[id];
  if (!F) return null;
  void caption;
  return <F />;
}
