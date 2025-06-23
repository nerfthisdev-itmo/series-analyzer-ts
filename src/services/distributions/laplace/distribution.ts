// @ts-ignore types are not developed
import { jStat } from "jstat";
import type {
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";
import type { AbstractSeries } from "../../series/AbstractSeries";

export type LaplaceDistributionCharacteristics = {
  mu: number;
  b: number;
  n: number;
};

export const laplace: TheoreticalDistribution<LaplaceDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): LaplaceDistributionCharacteristics => {
      return {
        mu: series.mean,
        b: Math.sqrt(series.variance / 2),
        n: series.n,
      };
    },

    getTheoreticalSkewness: () => {
      return 0;
    },

    getTheoreticalKurtosis: () => {
      return 3;
    },

    getStandardMetrics: (
      chars: LaplaceDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      return {
        mean: chars.mu,
        variance: 2 * chars.b ** 2,
        sigma: Math.SQRT2 * chars.b,
      };
    },

    cdf: (
      x: number,
      { n, mu, b }: LaplaceDistributionCharacteristics,
    ): number => {
      if (x < mu) {
        return 0.5 * Math.exp((x - mu) / b);
      } else {
        return 1 - 0.5 * Math.exp(-(x - mu) / b);
      }
    },

    pdf: (
      x: number,
      { n, mu, b }: LaplaceDistributionCharacteristics,
    ): number => {
      return (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
    },
  };
