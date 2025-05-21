import { describe, expect, it } from "vitest";
import { getInverseLaplace, laplaceFunction } from "@/services/variationSeries";

describe("math functions", () => {
  it("calculates laplace", () => {
    // close enough
    expect(laplaceFunction(0)).toBeCloseTo(0 + 0.5, 2);
    expect(laplaceFunction(0.5)).toBeCloseTo(0.1967 + 0.5, 2);
  });

  it("calculates inverse laplace", () => {
    expect(getInverseLaplace(0 + 0.5)).toBeCloseTo(0, 2);
    expect(getInverseLaplace(0.1967 + 0.5)).toBeCloseTo(0.5, 2);
  });
});
