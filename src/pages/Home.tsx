import { ArrowRight, Calculator, ChevronRight, Compass } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const stats = [
  { n: "103", l: "перевірені джерела" },
  { n: "10", l: "етапів шляху" },
  { n: "12", l: "схем і діаграм" },
  { n: "7", l: "робочих аркушів калькулятора" },
];

export function HomePage({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div>
      {/* cover — як на титульній сторінці посібника */}
      <header className="px-6 pb-16 pt-10 sm:px-12 sm:pt-14 lg:px-20 lg:pt-16">
        <p className="rise rise-1 mt-2 font-mono2 text-[11px] uppercase tracking-[0.22em] text-ink-faint sm:mt-4 sm:text-[12px]">
          Практичний посібник для продавця з України
        </p>

        <h1 className="rise rise-2 mt-8 tracking-[-0.035em] sm:mt-12">
          <span className="block text-[64px] font-bold leading-[1.02] sm:text-[124px] lg:text-[152px]">
            <span className="text-accent">Etsy</span> від нуля
          </span>
          <span className="block text-[38px] font-medium leading-[1.06] text-[#a1a1a6] sm:text-[72px] lg:text-[88px]">
            до масштабування
          </span>
        </h1>

        <p className="rise rise-2 mt-5 text-[12.5px] leading-snug text-ink-faint">
          Etsy® — торговельна марка Etsy, Inc. · матеріал не є офіційним виданням Etsy
        </p>

        <div className="bar-grow mt-10 h-[5px] w-[180px] rounded-full bg-accent sm:mt-14 sm:w-[380px]" />

        <p className="rise rise-3 mt-10 max-w-[620px] text-[16px] leading-[1.65] text-ink-soft sm:mt-14 sm:text-[19px]">
          Побудовано на офіційній документації Etsy, фінансовій звітності компанії та роз’ясненнях державних органів
          України. Не на чиємусь особистому досвіді. Кожне твердження промарковане джерелом: офіційне правило Etsy,
          підтверджені дані або досвід практика.
        </p>

        <div className="rise rise-4 mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className="card-lift rounded-2xl bg-paper-deep px-6 py-7 sm:px-8 sm:py-9"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="text-[40px] font-bold leading-none tracking-[-0.02em] text-[hsl(var(--ink))] sm:text-[52px]">
                {s.n}
              </div>
              <div className="mt-2.5 text-[13px] text-ink-faint sm:text-[14px]">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="rise rise-5 mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button onClick={() => onNav("etap-0")} className="btn-primary group w-full sm:w-auto">
            Почати з етапу 0
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button onClick={() => onNav("kalkuliator")} className="btn-secondary w-full sm:w-auto">
            <Calculator className="h-4 w-4" />
            Калькулятор економіки
          </button>
          <button
            onClick={() => onNav("hlosarij")}
            className="group inline-flex items-center justify-center gap-1 px-2 py-3.5 text-[14.5px] font-semibold text-accent transition-colors hover:text-accent-deep sm:py-0"
          >
            Глосарій
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* reading paths */}
      <section className="px-6 py-14 sm:px-12 lg:px-20">
        <Reveal>
          <p className="meta-label flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-accent" /> Три способи читати
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { who: "Ніколи не продавали онлайн", how: "Читайте підряд: Глосарій → Карта шляху → Етап 0", go: "hlosarij" },
            { who: "Уже маєте виробництво, потрібен канал збуту", how: "Карта шляху → Етап 1 → Етап 2 → далі підряд", go: "karta" },
            { who: "Магазин уже є, потрібне зростання", how: "Етапи 7–9 → розділи про AI → калькулятор", go: "etap-7" },
          ].map((p, i) => (
            <Reveal key={p.who} delay={i * 90}>
              <button
                onClick={() => onNav(p.go)}
                className="group card-lift h-full w-full rounded-2xl bg-paper-deep p-7 text-left"
              >
                <div className="text-[16px] font-bold leading-snug">{p.who}</div>
                <div className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{p.how}</div>
                <div className="mt-5 flex items-center gap-1 font-mono2 text-[11px] uppercase tracking-[0.14em] text-accent">
                  Відкрити <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* passport */}
      <section className="px-6 pb-20 pt-6 sm:px-12 lg:px-20">
        <Reveal>
          <p className="meta-label">Паспорт видання</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="card-lift mt-6 overflow-hidden rounded-2xl bg-paper-deep">
            {[
              ["Назва", "Etsy: від нуля до масштабування. Практичний посібник для продавця з України"],
              ["Редакція", "Версія 1.0 · дані станом на 12 серпня 2026 року"],
              ["Обсяг", "10 етапів · 12 оригінальних схем · 68 пунктів чеклістів · глосарій на 60 термінів · калькулятор із 7 робочих аркушів та інструкції"],
              ["Джерельна база", "103 унікальні джерела: 19 офіційних ресурсів Etsy, 5 державних і правових джерел України, 27 відеоресурсів практиків, галузева аналітика та незалежні рейтинги AI"],
              ["Метод", "Трирівневе маркування: [Etsy] — офіційне правило, [Дані] — звітність і роз’яснення держорганів, [Практика] — досвід продавців із підтвердженим результатом"],
              ["Для кого", "Для тих, хто ніколи не займався електронною комерцією, і для діючих продавців, яким потрібна система замість розрізнених порад"],
              ["Комплект", "Посібник + калькулятор економіки — обидва на цій платформі"],
              ["Оформлення", "Шрифт Inter (SIL OFL) · іконки Lucide (ISC) · схеми оригінальні"],
              ["Правові умови", "Розділ «Правові застереження». Норми звірено з офіційними текстами на zakon.rada.gov.ua"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-line/70 px-6 py-4 last:border-b-0 sm:grid-cols-[190px_1fr] sm:gap-6"
              >
                <span className="font-mono2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">{k}</span>
                <span className="text-[14px] leading-relaxed text-ink-soft">{v}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-[13.5px] leading-relaxed text-ink-faint">
            Матеріал не гарантує доходу чи будь-якого господарського результату — він дає перевірену інформацію й
            інструменти. Повні умови — у розділі «Правові застереження». Etsy® — торговельна марка Etsy, Inc.; матеріал
            не є офіційним виданням Etsy.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
