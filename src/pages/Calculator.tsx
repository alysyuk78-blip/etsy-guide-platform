import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { feeReference, feeReferenceTakeRate, feeSources, trackerRows } from "@/content";
import { useLocalState } from "@/hooks/useProgress";
import {
  FOP_GROUP_3_2026,
  calculateFopGroup3Tax2026,
  calculatePrice,
  calculatePriceCheck,
  calculateSellerFees,
  calculateUkrposhtaDutyEstimate,
  clampNumber,
} from "@/lib/calculator";

/* ── допоміжні ──────────────────────────────────────── */
const usd = (n: number) =>
  isFinite(n) ? `$${n.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";
const pct = (n: number) => (isFinite(n) ? `${(n * 100).toLocaleString("uk-UA", { maximumFractionDigits: 1 })}%` : "—");

function NumField({
  label,
  hint,
  value,
  onChange,
  step = 0.5,
  min = 0,
  max,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="text-[13.5px] font-semibold">{label}</span>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(clampNumber(Number(e.target.value), min, max))}
        className="calc-input mt-1.5"
      />
      {hint && <span className="mt-1 block text-[12px] leading-snug text-ink-faint">{hint}</span>}
    </label>
  );
}

function ResultRow({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-dashed border-line py-2.5 last:border-b-0 ${
        accent ? "rounded-lg bg-accent-soft px-3 -mx-3 border-b-0" : ""
      }`}
    >
      <span className={`text-[13.5px] ${strong ? "font-bold" : "text-ink-soft"}`}>{label}</span>
      <span className={`font-mono2 text-[15px] font-semibold ${accent ? "text-accent-deep" : ""}`}>{value}</span>
    </div>
  );
}

function Verdict({ kind, text }: { kind: "ok" | "mid" | "bad"; text: string }) {
  const styles = {
    ok: "bg-[hsl(var(--good))]/10 text-[hsl(var(--good))] border-[hsl(var(--good))]/40",
    mid: "bg-accent-soft text-accent-deep border-[hsl(var(--accent))]/50",
    bad: "bg-[hsl(var(--bad))]/8 text-[hsl(var(--bad))] border-[hsl(var(--bad))]/40",
  }[kind];
  return (
    <div className={`mt-4 rounded-lg border px-4 py-3 font-mono2 text-[13px] font-semibold uppercase tracking-wide ${styles}`}>
      {text}
    </div>
  );
}

function SheetHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-[24px] font-extrabold tracking-[-0.02em]">{title}</h2>
      <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-soft">{desc}</p>
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white/60 p-5">
      <p className="meta-label mb-4">{title}</p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

/* ── 1. Ціна товару ─────────────────────────────────── */
function SheetPrice() {
  const [v, setV] = useLocalState("etsy:calc:price", {
    materials: 9, hours: 1.5, rate: 8, packaging: 1.5, shipping: 14, duty: 4, other: 0,
    tx: 0.065, ppPct: 0.06, ppFix: 0.3, listing: 0.2, conv: 0, offsiteShare: 0.2, offsiteRate: 0.15, ads: 0.05,
    margin: 0.3, buyerShipping: 0,
  });
  const s = (k: keyof typeof v) => (n: number) => setV((p) => ({ ...p, [k]: n }));

  const r = useMemo(
    () =>
      calculatePrice({
        materials: v.materials,
        hours: v.hours,
        hourlyRate: v.rate,
        packaging: v.packaging,
        shipping: v.shipping,
        duty: v.duty,
        other: v.other,
        transactionRate: v.tx,
        paymentProcessingRate: v.ppPct,
        paymentProcessingFixed: v.ppFix,
        listingFee: v.listing,
        conversionRate: v.conv,
        offsiteShare: v.offsiteShare,
        offsiteRate: v.offsiteRate,
        adsRate: v.ads,
        targetMargin: v.margin,
        buyerShipping: v.buyerShipping,
      }),
    [v]
  );

  return (
    <div>
      <SheetHead title="Розрахунок ціни товару" desc="Заповніть поля. Приклад заповнено реальними значеннями — замініть на свої." />
      <div className="space-y-5">
        <FieldGroup title="Вхідні дані — заповніть">
          <NumField label="Матеріали на одиницю" hint="Метал, фурнітура, витратні матеріали" value={v.materials} onChange={s("materials")} />
          <NumField label="Час на виготовлення, годин" hint="Включно з підготовкою і прибиранням" value={v.hours} onChange={s("hours")} />
          <NumField label="Ваша ставка за годину" hint="Скільки коштує ваша година. Не занижуйте" value={v.rate} onChange={s("rate")} />
          <NumField label="Пакування" hint="Коробка, папір, наліпка, листівка" value={v.packaging} onChange={s("packaging")} />
          <NumField label="Фактична доставка" hint="Реальна вартість відправки, а не те, що платить покупець" value={v.shipping} onChange={s("shipping")} />
          <NumField label="Мито США (з аркуша «Мито США»)" hint="Для комерційних відправлень Укрпоштою до $2 500 — сума з системи перевізника; інші служби перевіряйте окремо" value={v.duty} onChange={s("duty")} />
          <NumField label="Інші витрати на одиницю" hint="Оренда, обладнання, підписки / кількість товарів" value={v.other} onChange={s("other")} />
          <div className="flex items-end">
            <div className="w-full rounded-lg bg-paper-deep px-3.5 py-2.5">
              <span className="text-[12px] text-ink-faint">Собівартість разом</span>
              <div className="font-mono2 text-[17px] font-semibold">{usd(r.cost)}</div>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="Параметри Etsy — перевірте">
          <NumField label="Комісія за транзакцію" hint="Офіційно 6,5% (0,065) від суми замовлення разом з доставкою" value={v.tx} onChange={s("tx")} step={0.005} max={1} />
          <NumField label="Обробка платежу, %" hint="Ставка для України: 6% (0,06)" value={v.ppPct} onChange={s("ppPct")} step={0.005} max={1} />
          <NumField label="Обробка платежу, фікс." hint="Ставка для України: $0,30" value={v.ppFix} onChange={s("ppFix")} step={0.05} />
          <NumField label="Плата за лістинг" hint="$0,20 за публікацію / поновлення раз на 4 місяці" value={v.listing} onChange={s("listing")} step={0.05} />
          <NumField label="Конвертація валюти" hint="2,5%, якщо валюта лістингу ≠ USD. При USD ставте 0" value={v.conv} onChange={s("conv")} step={0.005} max={1} />
          <NumField label="Частка замовлень з Offsite Ads" hint="Скільки % ваших продажів приходить із зовнішньої реклами (0,2 = 20%)" value={v.offsiteShare} onChange={s("offsiteShare")} step={0.05} max={1} />
          <NumField label="Ставка Offsite Ads" hint="15% (0,15), якщо магазин нижче порогу $10 000 за 365 днів; 12% після досягнення порогу" value={v.offsiteRate} onChange={s("offsiteRate")} step={0.01} max={1} />
          <NumField label="Витрати на Etsy Ads, % від виручки" hint="0, якщо реклама не запущена" value={v.ads} onChange={s("ads")} step={0.01} max={1} />
        </FieldGroup>

        <FieldGroup title="Що хочете заробляти">
          <NumField label="Бажана рентабельність (прибуток / виручка)" hint="30% (0,3) — плановий орієнтир, а не правило Etsy" value={v.margin} onChange={s("margin")} step={0.05} max={0.95} />
          <NumField label="Скільки покупець платить за доставку" hint="0 = доставка включена в ціну; окрема плата або включення в ціну — ваш сценарій тестування" value={v.buyerShipping} onChange={s("buyerShipping")} />
        </FieldGroup>

        <div className="rounded-xl border border-line bg-white/60 p-5">
          <p className="meta-label mb-3">Результат</p>
          <ResultRow label="Сумарна ставка комісій від виручки" value={pct(r.totalRate)} />
          <ResultRow label="Рекомендована ціна товару" value={usd(r.price)} strong accent />
          <ResultRow label="Виручка разом (ціна + доставка для покупця)" value={usd(r.revenue)} />
          <ResultRow label="Комісії Etsy в грошах" value={usd(r.fees)} />
          <ResultRow label="Прибуток з одиниці" value={usd(r.profit)} strong />
          <ResultRow label="Рентабельність за введеними припущеннями" value={pct(r.margin)} strong />
          <ResultRow label="Ваш заробіток за годину (з урахуванням прибутку)" value={usd(r.hourlyEarnings)} />
          {isFinite(r.price) && (
            <Verdict
              kind={r.margin >= 0.25 ? "ok" : r.margin >= 0.15 ? "mid" : "bad"}
              text={r.margin >= 0.25 ? "Є запас для коливань витрат" : r.margin >= 0.15 ? "Запас невеликий — перевірте сценарії" : "Запас мінімальний — перегляньте ціну або витрати"}
            />
          )}
          <div className="mt-4 space-y-1.5 font-mono2 text-[12px] text-ink-faint">
            <div>Перевірка: доставка ≤ 30% ціни? — {r.price > 0 ? ((v.shipping + v.duty) / r.price <= 0.3 ? "ТАК" : "НІ — товар завеликий або задалеко") : "—"}</div>
            <div>Перевірка: ціна ≥ $25? — {r.price >= 25 ? "ТАК" : "НІ — дешеві товари не витримують комісій"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 2. Перевірка ціни ──────────────────────────────── */
function SheetCheck() {
  const [v, setV] = useLocalState("etsy:calc:check", { price: 45, buyerShipping: 8, cogs: 15, shipDuty: 16 });
  const s = (k: keyof typeof v) => (n: number) => setV((p) => ({ ...p, [k]: n }));

  const r = useMemo(
    () =>
      calculatePriceCheck({
        price: v.price,
        buyerShipping: v.buyerShipping,
        cost: v.cogs,
        shippingAndDuty: v.shipDuty,
      }),
    [v]
  );

  return (
    <div>
      <SheetHead title="Перевірка готової ціни" desc="Уже маєте ціну (свою або конкурента)? Порахуйте, скільки з неї реально залишиться." />
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup title="Введіть">
          <NumField label="Ціна товару на Etsy" value={v.price} onChange={s("price")} />
          <NumField label="Доставка, яку платить покупець" value={v.buyerShipping} onChange={s("buyerShipping")} />
          <NumField label="Собівартість (матеріали + праця + пакування)" value={v.cogs} onChange={s("cogs")} />
          <NumField label="Фактична доставка + мито" value={v.shipDuty} onChange={s("shipDuty")} />
        </FieldGroup>
        <div className="rounded-xl border border-line bg-white/60 p-5">
          <p className="meta-label mb-3">Розкладка</p>
          <ResultRow label="Виручка разом" value={usd(r.revenue)} strong />
          <ResultRow label="Комісія за транзакцію 6,5%" value={usd(r.transactionFee)} />
          <ResultRow label="Обробка платежу 6% + $0,30" value={usd(r.paymentProcessingFee)} />
          <ResultRow label="Плата за лістинг" value={usd(r.listingFee)} />
          <ResultRow label="Комісії Etsy разом" value={usd(r.fees)} />
          <ResultRow label="Собівартість" value={usd(-v.cogs)} />
          <ResultRow label="Доставка і мито" value={usd(-v.shipDuty)} />
          <ResultRow label="Прибуток" value={usd(r.profit)} strong accent />
          <ResultRow label="Рентабельність" value={pct(r.margin)} strong />
          <ResultRow label="Якщо замовлення прийшло з Offsite Ads (−15%)" value={usd(r.profitWithOffsiteAds)} />
          <Verdict
            kind={r.margin >= 0.25 ? "ok" : r.margin >= 0.15 ? "mid" : "bad"}
            text={r.margin >= 0.25 ? "Є запас для коливань витрат" : r.margin >= 0.15 ? "Запас невеликий — перевірте доставку й рекламу" : "Маржа низька — рішення залежить від ваших ризиків і обсягу"}
          />
        </div>
      </div>
    </div>
  );
}

/* ── 3. Мито США ────────────────────────────────────── */
function SheetDuty() {
  const [v, setV] = useLocalState("etsy:calc:duty", { declared: 45, rate: 0.1 });
  const s = (k: keyof typeof v) => (n: number) => setV((p) => ({ ...p, [k]: n }));
  const duty = calculateUkrposhtaDutyEstimate(v.declared, v.rate);
  const threshold = 2500;

  return (
    <div>
      <SheetHead
        title="Мито при відправленні в США"
        desc="Орієнтовний розрахунок лише для комерційних відправлень Укрпоштою до США вартістю до $2 500. Остаточну суму автоматично визначає система Укрпошти."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup title="Введіть">
          <NumField label="Вартість товару в декларації, USD" hint="Реальна вартість. Заниження — порушення закону США" value={v.declared} onChange={s("declared")} />
          <NumField label="Ставка мита за 10-значним кодом УКТЗЕД" hint="З 24.07.2026 ставка залежить від коду товару. Візьміть її з калькулятора Укрпошти" value={v.rate} onChange={s("rate")} step={0.01} max={1} />
        </FieldGroup>
        <div className="rounded-xl border border-line bg-white/60 p-5">
          <p className="meta-label mb-3">Розрахунок</p>
          <ResultRow label="Заявлена вартість вкладення" value={usd(v.declared)} />
          <ResultRow label="Орієнтовне мито" value={usd(duty)} strong accent />
          <ResultRow label="Мито у % від ціни товару" value={v.declared > 0 ? pct(duty / v.declared) : "—"} />
          <ResultRow label="Поріг спрощеного оформлення" value={usd(threshold)} />
          <Verdict
            kind={v.declared <= threshold ? "ok" : "mid"}
            text={v.declared <= threshold ? "Перевірте суму в системі Укрпошти" : "Понад $2 500: цей аркуш не застосовується"}
          />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-line bg-white/60 p-5">
        <p className="meta-label mb-3">Що зробити</p>
        <ol className="space-y-2 text-[14px] text-ink-soft">
          <li>1. Знайти 10-значний код УКТЗЕД свого товару</li>
          <li>2. Порахувати точне мито в калькуляторі або особистому кабінеті Укрпошти</li>
          <li>3. Підставити суму в аркуш «1. Ціна товару», рядок «Мито США»</li>
          <li>4. Додати в опис лістингу абзац про можливі митні збори</li>
        </ol>
        <p className="mt-4 border-t border-dashed border-line pt-3 font-mono2 text-[11px] text-ink-faint">
          Межі цього аркуша: процедура Укрпошти для комерційних вкладень до $2 500. Для іншого перевізника перевірте його тариф, брокера та умови DDP/DAP окремо.
        </p>
      </div>
    </div>
  );
}

/* ── 4. Реклама ─────────────────────────────────────── */
function SheetAds() {
  const [v, setV] = useLocalState("etsy:calc:ads", { price: 45, profit: 13, budget: 5 });
  const s = (k: keyof typeof v) => (n: number) => setV((p) => ({ ...p, [k]: n }));
  const margin = v.price > 0 ? v.profit / v.price : 0;
  const breakeven = margin > 0 ? 1 / margin : NaN;
  const target = breakeven * 1.5;
  const testSpend = v.budget * 14;
  const salesNeeded = v.profit > 0 ? Math.ceil(testSpend / v.profit) : NaN;

  return (
    <div>
      <SheetHead title="Беззбитковий ROAS" desc="ROAS = скільки гривень виручки приносить одна гривня реклами." />
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup title="Введіть">
          <NumField label="Ціна товару" value={v.price} onChange={s("price")} />
          <NumField label="Прибуток з одиниці ДО реклами" value={v.profit} onChange={s("profit")} />
          <NumField label="Денний бюджет реклами" value={v.budget} onChange={s("budget")} />
        </FieldGroup>
        <div className="rounded-xl border border-line bg-white/60 p-5">
          <p className="meta-label mb-3">Розрахунок</p>
          <ResultRow label="Маржа, %" value={pct(margin)} />
          <ResultRow label="Беззбитковий ROAS (нижче — збиток)" value={isFinite(breakeven) ? `${breakeven.toFixed(2)}x` : "—"} strong accent />
          <ResultRow label="Цільовий ROAS (з запасом ×1,5)" value={isFinite(target) ? `${target.toFixed(2)}x` : "—"} strong />
          <ResultRow label="Максимальна вартість одного продажу" value={usd(v.profit)} />
          <ResultRow label="Витрати за 14 днів тесту" value={usd(testSpend)} />
          <ResultRow label="Скільки продажів має дати тест, щоб вийти в нуль" value={isFinite(salesNeeded) ? String(salesNeeded) : "—"} />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-line bg-white/60 p-5">
        <p className="meta-label mb-3">Правила</p>
        <ul className="space-y-2 text-[14px] text-ink-soft">
          <li>· Рекламуйте лише лістинги, які вже продаються без реклами</li>
          <li>· Дайте 14 днів без втручань, перевіряйте раз на 5–7 днів</li>
          <li>· Нижче беззбиткового ROAS після двох тижнів — вимикайте</li>
          <li>· Реклама підсилює те, що конвертує, і не лікує поганий лістинг</li>
        </ul>
      </div>
    </div>
  );
}

/* ── 5. План 12 тижнів ──────────────────────────────── */
const statuses = ["Не почато", "В роботі", "Готово"] as const;

function SheetPlan() {
  const [state, setState] = useLocalState<Record<number, { status: string; date: string }>>("etsy:calc:plan", {});
  const doneCount = trackerRows.filter((_, i) => state[i]?.status === "Готово").length;
  const progress = doneCount / 12;

  return (
    <div>
      <SheetHead title="Трекер запуску" desc="Проставляйте статус у стовпці «Статус». Дата — коли фактично завершили." />
      <div className="mb-5 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-deep">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="font-mono2 text-[12px] text-ink-soft">
          Виконано етапів: {doneCount} · Прогрес: {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="overflow-x-auto scroll-thin rounded-xl border border-line bg-white/60">
        <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
          <thead>
            <tr>
              {["Тиждень", "Завдання", "Результат наприкінці тижня", "Статус", "Дата"].map((h) => (
                <th key={h} className="border-b-2 border-[hsl(var(--ink))] px-4 py-3 text-left font-mono2 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trackerRows.map((row, i) => {
              const st = state[i]?.status ?? "Не почато";
              return (
                <tr key={i} className="border-b border-dashed border-line last:border-b-0">
                  <td className="px-4 py-2.5 font-mono2 font-semibold text-accent">{row.week}</td>
                  <td className={`px-4 py-2.5 font-medium ${row.task === "ПУБЛІКАЦІЯ" ? "text-accent-deep" : ""}`}>{row.task}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.result}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={st}
                      onChange={(e) => setState((p) => ({ ...p, [i]: { status: e.target.value, date: p[i]?.date ?? "" } }))}
                      className={`rounded-md border px-2 py-1.5 font-mono2 text-[12px] outline-none ${
                        st === "Готово"
                          ? "border-[hsl(var(--good))]/50 bg-[hsl(var(--good))]/10 text-[hsl(var(--good))]"
                          : st === "В роботі"
                            ? "border-[hsl(var(--accent))]/50 bg-accent-soft text-accent-deep"
                            : "border-line bg-white text-ink-soft"
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="date"
                      value={state[i]?.date ?? ""}
                      onChange={(e) => setState((p) => ({ ...p, [i]: { status: p[i]?.status ?? "Не почато", date: e.target.value } }))}
                      className="rounded-md border border-line bg-white px-2 py-1.5 font-mono2 text-[12px] text-ink-soft outline-none"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 6. Облік продажів ──────────────────────────────── */
interface SaleRow {
  date: string;
  item: string;
  price: string;
  shipping: string;
  cogs: string;
  nbu: string;
}

function SheetJournal() {
  const [rows, setRows] = useLocalState<SaleRow[]>("etsy:calc:journal", [
    { date: "2026-09-01", item: "Решітка вент. 200×200", price: "45", shipping: "0", cogs: "22", nbu: "41.5" },
  ]);

  const upd = (i: number, k: keyof SaleRow, val: string) =>
    setRows((p) => p.map((r, j) => (j === i ? { ...r, [k]: val } : r)));
  const add = () => setRows((p) => [...p, { date: "", item: "", price: "", shipping: "", cogs: "", nbu: "" }]);
  const del = (i: number) => setRows((p) => p.filter((_, j) => j !== i));

  const calc = rows.map((r) => {
    const price = parseFloat(r.price);
    if (!isFinite(price)) return null;
    const shipping = parseFloat(r.shipping) || 0;
    const cogs = parseFloat(r.cogs) || 0;
    const nbu = parseFloat(r.nbu) || 0;
    const total = price + shipping;
    const fees = -calculateSellerFees(total).total;
    const profit = total - fees - cogs;
    return { total, fees, cogs, profit, margin: total > 0 ? profit / total : 0, uah: total * nbu };
  });
  const sums = calc.reduce(
    (a, c) =>
      c
        ? { total: a.total + c.total, fees: a.fees + c.fees, cogs: a.cogs + c.cogs, profit: a.profit + c.profit, uah: a.uah + c.uah }
        : a,
    { total: 0, fees: 0, cogs: 0, profit: 0, uah: 0 }
  );
  const taxes = calculateFopGroup3Tax2026(sums.uah);

  const cellCls = "w-full min-w-[70px] rounded border border-transparent bg-transparent px-1.5 py-1 font-mono2 text-[12.5px] outline-none focus:border-[hsl(var(--accent))] focus:bg-white";

  return (
    <div>
      <SheetHead
        title="Журнал продажів"
        desc="Для обережного планування журнал використовує повну суму замовлення до комісій Etsy. Підтвердьте базу й дату доходу для власної схеми Etsy → Payoneer → банк у бухгалтера або власній ІПК."
      />
      <div className="overflow-x-auto scroll-thin rounded-xl border border-line bg-white/60">
        <table className="w-full min-w-[980px] border-collapse text-[13px]">
          <thead>
            <tr>
              {["Дата", "Товар", "Ціна", "Доставка", "Разом", "Комісії Etsy", "Собівартість", "Прибуток", "Марж., %", "Курс НБУ", "Дохід, грн", ""].map((h) => (
                <th key={h} className="border-b-2 border-[hsl(var(--ink))] px-2.5 py-3 text-left font-mono2 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const c = calc[i];
              return (
                <tr key={i} className="border-b border-dashed border-line">
                  <td className="px-2 py-1.5"><input type="date" value={r.date} onChange={(e) => upd(i, "date", e.target.value)} className={cellCls} /></td>
                  <td className="px-2 py-1.5"><input value={r.item} placeholder="Товар" onChange={(e) => upd(i, "item", e.target.value)} className={`${cellCls} min-w-[150px]`} /></td>
                  <td className="px-2 py-1.5"><input value={r.price} placeholder="0" onChange={(e) => upd(i, "price", e.target.value)} className={cellCls} /></td>
                  <td className="px-2 py-1.5"><input value={r.shipping} placeholder="0" onChange={(e) => upd(i, "shipping", e.target.value)} className={cellCls} /></td>
                  <td className="px-2 py-1.5 font-mono2 text-[12.5px]">{c ? c.total.toFixed(2) : ""}</td>
                  <td className="px-2 py-1.5 font-mono2 text-[12.5px] text-ink-soft">{c ? c.fees.toFixed(2) : ""}</td>
                  <td className="px-2 py-1.5"><input value={r.cogs} placeholder="0" onChange={(e) => upd(i, "cogs", e.target.value)} className={cellCls} /></td>
                  <td className={`px-2 py-1.5 font-mono2 text-[12.5px] font-semibold ${c && c.profit < 0 ? "text-[hsl(var(--bad))]" : ""}`}>{c ? c.profit.toFixed(2) : ""}</td>
                  <td className="px-2 py-1.5 font-mono2 text-[12.5px]">{c ? pct(c.margin) : ""}</td>
                  <td className="px-2 py-1.5"><input value={r.nbu} placeholder="0" onChange={(e) => upd(i, "nbu", e.target.value)} className={cellCls} /></td>
                  <td className="px-2 py-1.5 font-mono2 text-[12.5px]">{c ? c.uah.toFixed(2) : ""}</td>
                  <td className="px-2 py-1.5">
                    <button onClick={() => del(i)} className="rounded p-1 text-ink-faint hover:text-[hsl(var(--bad))]" aria-label="Видалити рядок">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-paper-deep font-semibold">
              <td className="px-2 py-2.5" colSpan={4}>РАЗОМ</td>
              <td className="px-2 py-2.5 font-mono2 text-[12.5px]">{sums.total.toFixed(2)}</td>
              <td className="px-2 py-2.5 font-mono2 text-[12.5px]">{sums.fees.toFixed(2)}</td>
              <td className="px-2 py-2.5 font-mono2 text-[12.5px]">{sums.cogs.toFixed(2)}</td>
              <td className="px-2 py-2.5 font-mono2 text-[12.5px]">{sums.profit.toFixed(2)}</td>
              <td className="px-2 py-2.5 font-mono2 text-[12.5px]">{sums.total > 0 ? pct(sums.profit / sums.total) : ""}</td>
              <td />
              <td className="px-2 py-2.5 font-mono2 text-[12.5px]">{sums.uah.toFixed(2)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={add} className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:border-[hsl(var(--accent))] hover:text-accent-deep">
        <Plus className="h-4 w-4" /> Додати продаж
      </button>
      <div className="mt-5 rounded-xl border border-line bg-white/60 p-5">
        <ResultRow label="Єдиний податок 5% (III група, без ПДВ)" value={`${taxes.singleTax.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} грн`} />
        <ResultRow label="Військовий збір 1%" value={`${taxes.militaryLevy.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} грн`} />
        <ResultRow label="Разом податки з доходу — 6%" value={`${taxes.incomeTaxes.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} грн`} strong accent />
        <p className="mt-3 text-[12.5px] text-ink-faint">
          ЄСВ не включено: у 2026 році мінімальний внесок — {FOP_GROUP_3_2026.monthlyMinimumSocialContributionUah.toLocaleString("uk-UA", { minimumFractionDigits: 2 })} грн/міс., якщо немає законної пільги. Це довідковий розрахунок для ФОП III групи без ПДВ; перевірте свою ситуацію з бухгалтером.
        </p>
      </div>
    </div>
  );
}

/* ── 7. Довідник комісій ────────────────────────────── */
function SheetFees() {
  return (
    <div>
      <SheetHead title="Довідник комісій Etsy" desc="Станом на 12 серпня 2026. Джерело: Etsy Fees & Payments Policy" />
      <div className="overflow-x-auto scroll-thin rounded-xl border border-line bg-white/60">
        <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
          <thead>
            <tr>
              {["Комісія", "Розмір", "Коли стягується"].map((h) => (
                <th key={h} className="border-b-2 border-[hsl(var(--ink))] px-4 py-3 text-left font-mono2 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeReference.map((f) => (
              <tr key={f.fee} className="border-b border-dashed border-line">
                <td className="px-4 py-2.5 font-medium">{f.fee}</td>
                <td className="px-4 py-2.5 font-mono2 font-semibold text-accent-deep">{f.size}</td>
                <td className="px-4 py-2.5 text-ink-soft">{f.when}</td>
              </tr>
            ))}
            <tr className="bg-accent-soft">
              <td className="px-4 py-3 font-bold text-accent-deep">{feeReferenceTakeRate.label}</td>
              <td className="px-4 py-3 font-mono2 text-[15px] font-bold text-accent-deep">{feeReferenceTakeRate.size}</td>
              <td className="px-4 py-3 text-ink-soft">{feeReferenceTakeRate.when}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-xl border border-line bg-white/60 p-5">
        <p className="meta-label mb-3">Джерела</p>
        <ul className="space-y-1.5 font-mono2 text-[12.5px] text-ink-soft">
          {feeSources.map((s) => {
            const url = s.split(" — ").pop() ?? "";
            const name = s.slice(0, s.length - url.length - 3);
            return (
              <li key={s}>
                · {name} —{" "}
                <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="src-link">
                  {url}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ── 0. Інструкція ──────────────────────────────────── */
function SheetIntro() {
  return (
    <div>
      <SheetHead
        title="Etsy-калькулятор для продавця з України"
        desc="Версія від 12 серпня 2026 · комісії звірені з офіційною політикою Etsy"
      />
      <div className="rounded-xl border border-line bg-white/60 p-5">
        <p className="meta-label mb-3">Як користуватися</p>
        <ul className="space-y-2 text-[14px] text-ink-soft">
          <li>· Поля для введення — заповнюєте тільки їх.</li>
          <li>· Ключові припущення — перевірте, чи відповідають вашій ситуації.</li>
          <li>· Решта рахується автоматично.</li>
        </ul>
      </div>
      <div className="mt-5 rounded-xl border border-line bg-white/60 p-5">
        <p className="meta-label mb-3">Аркуші</p>
        <ul className="space-y-0">
          {[
            ["1. Ціна товару", "Головний аркуш. Вводите собівартість — отримуєте рекомендовану ціну і прибуток."],
            ["2. Перевірка ціни", "Уже маєте ціну? Перевірте, скільки з неї реально залишиться."],
            ["3. Мито США", "Орієнтир для комерційних відправлень Укрпоштою до $2 500; фінальна сума — в системі перевізника."],
            ["4. Реклама", "Беззбитковий ROAS: скільки можна платити за продаж, щоб не працювати в збиток."],
            ["5. План 12 тижнів", "Трекер запуску: етапи, дедлайни, статус."],
            ["6. Облік продажів", "Журнал замовлень: дохід, комісії, прибуток, дані для ФОП."],
            ["7. Довідник комісій", "Усі ставки Etsy з посиланнями на джерела."],
          ].map(([k, v]) => (
            <li key={k} className="grid gap-1 border-b border-dashed border-line py-2.5 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-6">
              <span className="font-mono2 text-[12.5px] font-semibold">{k}</span>
              <span className="text-[13.5px] text-ink-soft">{v}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 rounded-xl bg-[hsl(var(--ink))] p-5 text-[#fff]">
        <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Головне правило</p>
        <p className="mt-2 text-[14.5px] leading-relaxed">
          Рахуйте власні seller fees за сценарієм замовлення: 6,5% transaction fee, 6% + $0,30 processing для України,
          $0,20 за лістинг та лише застосовні вам реклама, конвертація й податки. Корпоративний revenue take rate 25,9%
          у Q2 2026 — це виручка Etsy, поділена на GMS; він не є комісією конкретного продавця і не підставляється у формулу.
        </p>
      </div>
      <div className="mt-5 rounded-xl border border-[hsl(var(--accent))]/50 bg-accent-soft p-5">
        <p className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-deep">Увага</p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          Калькулятор не є податковою консультацією. Для планування він консервативно бере повну суму замовлення до
          комісій Etsy. Податкову базу, дату доходу та облік виплат через Payoneer перевірте для свого випадку з
          бухгалтером або в індивідуальній податковій консультації — див. аркуш «Облік продажів».
        </p>
      </div>
    </div>
  );
}

/* ── головна сторінка калькулятора ──────────────────── */
const tabs = [
  { id: "intro", label: "Інструкція" },
  { id: "price", label: "1. Ціна товару" },
  { id: "check", label: "2. Перевірка ціни" },
  { id: "duty", label: "3. Мито США" },
  { id: "ads", label: "4. Реклама" },
  { id: "plan", label: "5. План 12 тижнів" },
  { id: "journal", label: "6. Облік продажів" },
  { id: "fees", label: "7. Довідник комісій" },
];

export function CalculatorPage() {
  const [tab, setTab] = useLocalState<string>("etsy:calc:tab", "intro");
  return (
    <article>
      <header className="border-b border-line px-6 pb-8 pt-12 sm:px-12 lg:px-16">
        <p className="meta-label rise">Інструменти</p>
        <h1 className="rise rise-1 mt-4 max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-[44px]">
          Калькулятор економіки
        </h1>
        <p className="rise rise-2 mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
          Сім робочих аркушів із посібника — інтерактивно. Правило: заповнюєте лише поля для введення, решта рахується
          сама. Дані зберігаються у вашому браузері.
        </p>
      </header>
      <div className="sticky top-[57px] z-30 border-b border-line bg-[hsl(var(--paper))]/95 backdrop-blur lg:top-0">
        <div className="scroll-thin flex gap-1 overflow-x-auto px-4 py-2.5 sm:px-10 lg:px-14">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono2 text-[12px] transition-colors ${
                tab === t.id
                  ? "bg-[hsl(var(--ink))] font-semibold text-[#fff]"
                  : "text-ink-soft hover:bg-paper-deep"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-4xl px-6 pb-20 pt-8 sm:px-12 lg:px-16">
        {tab === "intro" && <SheetIntro />}
        {tab === "price" && <SheetPrice />}
        {tab === "check" && <SheetCheck />}
        {tab === "duty" && <SheetDuty />}
        {tab === "ads" && <SheetAds />}
        {tab === "plan" && <SheetPlan />}
        {tab === "journal" && <SheetJournal />}
        {tab === "fees" && <SheetFees />}
      </div>
    </article>
  );
}
