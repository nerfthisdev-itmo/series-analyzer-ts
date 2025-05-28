import type { IntervalVariationSeries } from "../intervalSeries";
import type { VariationSeries } from "../variationSeries";

export type DistributionType = "normal" | "binomial" | "poisson" | "laplace";

export type DistributionCharacteristics = {};

export type TheoreticalDistribution<T extends DistributionCharacteristics> = {
  getCharacteristicsFromEmpiricalData: (
    series: IntervalVariationSeries | VariationSeries,
  ) => T;

  getTheoreticalKurtosis: (characteristics: T) => number;

  getTheoreticalSkewness: (characteristics: T) => number;

  getConfidenceIntervals: (
    gamma: number,
    characteristics: T,
  ) => {
    left: T;
    right: T;
  };

  calculateTheoreticalFrequencies: (
    characteristics: T,
    values: Array<number>,
  ) => Record<number, number>;
};

export function isIntervalSeries(
  series: IntervalVariationSeries | VariationSeries,
): series is IntervalVariationSeries {
  return "intervalCount" in series;
}

export function isVariationSeries(
  series: IntervalVariationSeries | VariationSeries,
): series is VariationSeries {
  return !("intervalCount" in series);
}
