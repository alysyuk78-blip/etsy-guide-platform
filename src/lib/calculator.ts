export const SELLER_FEE_DEFAULTS = {
  transactionRate: 0.065,
  paymentProcessingRate: 0.06,
  paymentProcessingFixed: 0.3,
  listingFee: 0.2,
} as const;

export const FOP_GROUP_3_2026 = {
  singleTaxRate: 0.05,
  militaryLevyRate: 0.01,
  monthlyMinimumSocialContributionUah: 1902.34,
} as const;

export function clampNumber(value: number, min = 0, max = Number.POSITIVE_INFINITY) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export interface PriceInputs {
  materials: number;
  hours: number;
  hourlyRate: number;
  packaging: number;
  shipping: number;
  duty: number;
  other: number;
  transactionRate: number;
  paymentProcessingRate: number;
  paymentProcessingFixed: number;
  listingFee: number;
  conversionRate: number;
  offsiteShare: number;
  offsiteRate: number;
  adsRate: number;
  targetMargin: number;
  buyerShipping: number;
}

export function calculatePrice(input: PriceInputs) {
  const cost =
    input.materials +
    input.hours * input.hourlyRate +
    input.packaging +
    input.shipping +
    input.duty +
    input.other;
  const totalRate =
    input.transactionRate +
    input.paymentProcessingRate +
    input.conversionRate +
    input.offsiteShare * input.offsiteRate +
    input.adsRate;
  const denominator = 1 - totalRate - input.targetMargin;
  const price =
    denominator > 0
      ? (cost + input.paymentProcessingFixed + input.listingFee) / denominator - input.buyerShipping
      : Number.NaN;
  const revenue = price + input.buyerShipping;
  const fees = revenue * totalRate + input.paymentProcessingFixed + input.listingFee;
  const profit = revenue - fees - cost;
  const margin = revenue > 0 ? profit / revenue : Number.NaN;
  const hourlyEarnings = input.hours > 0 ? (profit + input.hours * input.hourlyRate) / input.hours : Number.NaN;

  return { cost, totalRate, price, revenue, fees, profit, margin, hourlyEarnings };
}

export interface PriceCheckInputs {
  price: number;
  buyerShipping: number;
  cost: number;
  shippingAndDuty: number;
  offsiteRate?: number;
}

export function calculatePriceCheck(input: PriceCheckInputs) {
  const revenue = input.price + input.buyerShipping;
  const { transactionFee, paymentProcessingFee, listingFee, total: fees } = calculateSellerFees(revenue);
  const profit = revenue + fees - input.cost - input.shippingAndDuty;
  const margin = revenue > 0 ? profit / revenue : Number.NaN;
  const profitWithOffsiteAds = profit - revenue * (input.offsiteRate ?? 0.15);

  return { revenue, transactionFee, paymentProcessingFee, listingFee, fees, profit, margin, profitWithOffsiteAds };
}

export function calculateSellerFees(revenue: number) {
  const transactionFee = -(revenue * SELLER_FEE_DEFAULTS.transactionRate);
  const paymentProcessingFee = -(
    revenue * SELLER_FEE_DEFAULTS.paymentProcessingRate + SELLER_FEE_DEFAULTS.paymentProcessingFixed
  );
  const listingFee = -SELLER_FEE_DEFAULTS.listingFee;
  return { transactionFee, paymentProcessingFee, listingFee, total: transactionFee + paymentProcessingFee + listingFee };
}

export function calculateUkrposhtaDutyEstimate(declaredValue: number, dutyRate: number) {
  return declaredValue * dutyRate;
}

export function calculateFopGroup3Tax2026(incomeUah: number) {
  const singleTax = incomeUah * FOP_GROUP_3_2026.singleTaxRate;
  const militaryLevy = incomeUah * FOP_GROUP_3_2026.militaryLevyRate;
  return { singleTax, militaryLevy, incomeTaxes: singleTax + militaryLevy };
}
