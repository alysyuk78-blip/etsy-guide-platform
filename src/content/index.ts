import { sectionsA } from "./sections";
import { sectionsB } from "./sections2";
import { sectionsC } from "./sections3";
import { stages } from "./stages";
import { stages2 } from "./stages2";
import type { SectionDef, StageDef } from "./types";

export const allStages: StageDef[] = [...stages, ...stages2];
export const allSections: SectionDef[] = [...sectionsA, ...sectionsB, ...sectionsC];

export const glossarySection: SectionDef = {
  id: "hlosarij",
  group: "Початок",
  nav: "Глосарій",
  title: "Глосарій: 60 термінів, які вам зустрінуться",
  subtitle: "Інтерфейс Etsy — англійською. Тут переклад і пояснення простими словами. Поверніться сюди щоразу, коли зустрінете незнайоме слово.",
  blocks: [],
};

export interface NavItem {
  id: string;
  label: string;
  group: string;
  kind: "home" | "section" | "stage" | "glossary" | "calculator";
}

export const navItems: NavItem[] = [
  { id: "home", label: "Обкладинка", group: "Початок", kind: "home" },
  { id: "vstup", label: "Як користуватися", group: "Початок", kind: "section" },
  { id: "metodolohiia", label: "На чому побудовано", group: "Початок", kind: "section" },
  { id: "hlosarij", label: "Глосарій · 60 термінів", group: "Початок", kind: "glossary" },
  { id: "karta", label: "Карта шляху", group: "Початок", kind: "section" },
  ...allStages.map((s) => ({
    id: s.slug,
    label: `Етап ${s.num}. ${s.title}`,
    group: "Десять етапів",
    kind: "stage" as const,
  })),
  { id: "ai-instrumenty", label: "AI-інструменти", group: "AI", kind: "section" },
  { id: "ai-poshuk", label: "AI-пошук 2026", group: "AI", kind: "section" },
  { id: "kalkuliator", label: "Калькулятор економіки", group: "Інструменти", kind: "calculator" },
  { id: "kalkuliator-gajd", label: "Як користуватися калькулятором", group: "Інструменти", kind: "section" },
  { id: "problemy", label: "Коли щось пішло не так", group: "Інструменти", kind: "section" },
  { id: "bezpeka", label: "Безпека акаунта", group: "Інструменти", kind: "section" },
  { id: "kalendar", label: "Календар 12 тижнів", group: "Інструменти", kind: "section" },
  { id: "rynok", label: "Ринок навчальних матеріалів", group: "Контекст", kind: "section" },
  { id: "biblioteka", label: "Бібліотека ресурсів", group: "Контекст", kind: "section" },
  { id: "15-pravyl", label: "15 правил", group: "Фінал", kind: "section" },
  { id: "pravovi", label: "Правові застереження", group: "Фінал", kind: "section" },
];

export const navGroups = ["Початок", "Десять етапів", "AI", "Інструменти", "Контекст", "Фінал"];

export function findContent(id: string): { kind: string; section?: SectionDef; stage?: StageDef } {
  if (id === "home") return { kind: "home" };
  if (id === "hlosarij") return { kind: "glossary", section: glossarySection };
  if (id === "kalkuliator") return { kind: "calculator" };
  const stage = allStages.find((s) => s.slug === id);
  if (stage) return { kind: "stage", stage };
  const section = allSections.find((s) => s.id === id);
  if (section) return { kind: "section", section };
  return { kind: "home" };
}

// ---- calculator data ----

export const trackerRows = [
  { week: "1", task: "Ідея товару, перевірка за правилами Etsy", result: "Товар обрано, законність підтверджено" },
  { week: "2", task: "Дослідження ніші, розрахунок економіки", result: "Ніша обрана, список 15–20 товарів" },
  { week: "2–3", task: "ФОП, банк, Payoneer (паралельно)", result: "Фінансові рейки готові" },
  { week: "3", task: "Створення магазину", result: "Магазин відкрито й оформлено" },
  { week: "3–4", task: "Фотозйомка", result: "8–10 фото + відео на кожен товар" },
  { week: "4", task: "Тексти й SEO", result: "Усі лістинги написані" },
  { week: "4–5", task: "Доставка й мито", result: "Профілі доставки й ціни фінальні" },
  { week: "5", task: "ПУБЛІКАЦІЯ", result: "Магазин працює" },
  { week: "6–8", task: "Перші продажі, спостереження", result: "Перший продаж, перший відгук" },
  { week: "9–12", task: "Оптимізація, перша реклама", result: "Стабільні 2–5 продажів на тиждень" },
  { week: "13+", task: "Зростання: +10 лістингів щотижня", result: "Star Seller" },
  { week: "25+", task: "Масштабування", result: "Делегування, другий канал продажів" },
];

export const feeReference: { fee: string; size: string; when: string }[] = [
  { fee: "Плата за лістинг", size: "$0,20", when: "При публікації; поновлення кожні 4 місяці" },
  { fee: "Плата за лістинг (множинна к-сть)", size: "$0,20", when: "За кожну додаткову одиницю в замовленні" },
  { fee: "Комісія за транзакцію", size: "6,5%", when: "З ціни товару + доставка + пакування подарунка" },
  { fee: "Обробка платежу (Україна)", size: "6% + $0,30", when: "З повної суми, включно з доставкою й податком" },
  { fee: "Конвертація валюти", size: "2,5%", when: "Якщо валюта лістингу ≠ валюта рахунку" },
  { fee: "Offsite Ads (до $10 000/рік)", size: "15%", when: "Лише з замовлень із зовнішньої реклами, максимум $100" },
  { fee: "Offsite Ads (від $10 000/рік)", size: "12%", when: "Ставка залишається назавжди; відмова неможлива" },
  { fee: "Etsy Ads", size: "за бюджетом", when: "Внутрішня реклама, добровільна" },
  { fee: "Etsy Plus", size: "$10/міс", when: "Опційна підписка" },
  { fee: "Pattern", size: "$15/міс", when: "Окремий сайт на базі Etsy, після 30 днів пробного" },
  { fee: "Regulatory operating fee", size: "не для України", when: "UK, Франція, Італія, Індія, Іспанія, Туреччина, В’єтнам, Канада" },
  { fee: "Стартовий внесок", size: "залежить від країни", when: "Одноразово при відкритті магазину, орієнтир $15" },
];

export const feeReferenceTakeRate = {
  label: "Корпоративний revenue take rate Etsy (Q2 2026)",
  size: "25,9%",
  when: "Виручка Etsy / GMS. Не є ставкою комісії окремого продавця і не використовується у формулах вище",
};

export const feeSources = [
  "Etsy Fees & Payments Policy — etsy.com/legal/fees/",
  "Etsy processing fee для України — help.etsy.com/hc/en-gb/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy",
  "Etsy Q2 2026 Form 10-Q (визначення take rate) — investors.etsy.com/sec-filings/all-sec-filings/content/0001370637-26-000080/etsy-20260630.htm",
  "Процедура Укрпошти для США — e-export.ukrposhta.ua/oformlennya-vidpravlen-do-ssha-za-novymy-mytnymy-pravylamy-pokrokova-instrukcziya-dlya-korektnogo-rozrahunku/",
];
