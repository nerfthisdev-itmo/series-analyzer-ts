import { jStat } from "jstat";
import type { IntervalVariationSeries } from "./intervalSeries";
import type { VariationSeries } from "./variationSeries";

export const laplaceFunction = (x: number): number => {
  return x < 0 ? 0.5 * Math.exp(x) : 1 - 0.5 * Math.exp(-x);
};

export const studentCoefficient = (gamma: number, n: number): number => {
  const degreesOfFreedom = n - 1;
  return jStat.studentt.inv((1 + gamma) / 2, degreesOfFreedom);
};

export const getInverseLaplace = (p: number): number => {
  return jStat.normal.inv(p, 0, 1);
};
