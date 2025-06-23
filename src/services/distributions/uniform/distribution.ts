// @ts-ignore types are not developed
import { jStat } from "jstat";
import type {
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";
import type { AbstractSeries } from "../../series/AbstractSeries";

export type UniformDistributionCharacteristics = {
  a: number;
  b: number;
  n: number;
};

export const uniform: TheoreticalDistribution<UniformDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): UniformDistributionCharacteristics => {
      return {
        a: series.min,
        b: series.max,
        n: series.n,
      };
    },

    getTheoreticalSkewness: () => {
      return 0; // Uniform distribution is symmetric
    },

    getTheoreticalKurtosis: () => {
      return 9 / 5; // Non-excess kurtosis for uniform distribution
    },

    getStandardMetrics: (
      chars: UniformDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      const mean = (chars.a + chars.b) / 2;
      const variance = (chars.b - chars.a) ** 2 / 12;
      return {
        mean: mean,
        variance: variance,
        sigma: Math.sqrt(variance),
      };
    },

    cdf: (
      x: number,
      { a, b, n }: UniformDistributionCharacteristics,
    ): number => {
      if (x <= a) return 0;
      if (x >= b) return n;
      return (x - a) / (b - a);
    },

    pdf: (x: number, { a, b }: UniformDistributionCharacteristics): number => {
      if (x < a || x > b) return 0;
      return 1 / (b - a);
    },
  };
