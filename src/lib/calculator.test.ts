import { describe, expect, it } from "vitest";
import {
  calculateFopGroup3Tax2026,
  calculatePrice,
  calculatePriceCheck,
  calculateUkrposhtaDutyEstimate,
  clampNumber,
} from "./calculator";

describe("calculator regression", () => {
  it("calculates a target price from the current default inputs", () => {
    const result = calculatePrice({
      materials: 9,
      hours: 1.5,
      hourlyRate: 8,
      packaging: 1.5,
      shipping: 14,
      duty: 4,
      other: 0,
      transactionRate: 0.065,
      paymentProcessingRate: 0.06,
      paymentProcessingFixed: 0.3,
      listingFee: 0.2,
      conversionRate: 0,
      offsiteShare: 0.2,
      offsiteRate: 0.15,
      adsRate: 0.05,
      targetMargin: 0.3,
      buyerShipping: 0,
    });

    expect(result.price).toBeCloseTo(82.83, 2);
    expect(result.margin).toBeCloseTo(0.3, 8);
  });

  it("returns no recommended price when rates and target margin consume all revenue", () => {
    const result = calculatePrice({
      materials: 1,
      hours: 1,
      hourlyRate: 1,
      packaging: 0,
      shipping: 0,
      duty: 0,
      other: 0,
      transactionRate: 0.5,
      paymentProcessingRate: 0.3,
      paymentProcessingFixed: 0,
      listingFee: 0,
      conversionRate: 0,
      offsiteShare: 0,
      offsiteRate: 0,
      adsRate: 0,
      targetMargin: 0.2,
      buyerShipping: 0,
    });

    expect(result.price).toBeNaN();
  });

  it("calculates seller fees without using Etsy corporate take rate", () => {
    const result = calculatePriceCheck({ price: 45, buyerShipping: 8, cost: 15, shippingAndDuty: 16 });

    expect(result.fees).toBeCloseTo(-7.125, 3);
    expect(result.margin).toBeCloseTo(0.280660377, 8);
    expect(result.profitWithOffsiteAds).toBeCloseTo(6.925, 3);
  });

  it("uses declared value, not shipping, for the Ukrposhta duty estimate", () => {
    expect(calculateUkrposhtaDutyEstimate(45, 0.1)).toBe(4.5);
  });

  it("calculates 2026 group III single tax and military levy separately", () => {
    expect(calculateFopGroup3Tax2026(100_000)).toEqual({
      singleTax: 5_000,
      militaryLevy: 1_000,
      incomeTaxes: 6_000,
    });
  });

  it("clamps invalid numeric input to its allowed range", () => {
    expect(clampNumber(-5, 0)).toBe(0);
    expect(clampNumber(1.5, 0, 1)).toBe(1);
    expect(clampNumber(Number.NaN, 0, 1)).toBe(0);
  });
});
