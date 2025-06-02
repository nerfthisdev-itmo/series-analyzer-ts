import { describe, expect, it } from "vitest";
import { VariationSeries } from "@/services/series/variationSeries";

describe("VariationSeries", () => {
  const testData = [
    2, 0, 1, 2, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 0, 4, 0, 0, 1, 0, 4, 1, 1,
    0, 2, 1, 0, 0, 2, 1, 1, 1, 1, 0, 1, 1, 0, 3, 1, 2, 1, 0, 1, 2, 1, 2, 3, 0,
    2, 4, 0, 0, 0, 3, 0, 2, 0, 2, 2, 2, 1, 1,
  ];

  const series = new VariationSeries(testData);

  it("calculate basic statistics correctly", () => {
    expect(series.min).toBe(0);
    expect(series.max).toBe(4);
    expect(series.range).toBe(4);
    expect(series.n).toBe(64);
  });

  it("calculate empirical distribution function correctly", () => {
    const data_to_check = [
      { input: -1, expected_output: 0.0 },
      { input: 0, expected_output: 0.36 },
      { input: 1, expected_output: 0.67 },
      { input: 2, expected_output: 0.91 },
      { input: 3, expected_output: 0.95 },
      { input: 4, expected_output: 1.0 },
    ];

    data_to_check.forEach(({ input, expected_output }) => {
      expect(series.getCdf(input)).toBeCloseTo(expected_output, 2);
    });
  });

  it("calculate expected value estimate and sample deviation", () => {
    expect(series.mean).toBeCloseTo(1.1094, 1);
    expect(series.sampleStandardDeviation).toBeCloseTo(1.1, 1);
  });

  it("calculate standard deviation", () => {
    expect(series.standardDeviation).toBeCloseTo(1.0914);
  });
});
