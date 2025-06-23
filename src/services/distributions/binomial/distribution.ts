// @ts-ignore types are not developed
import { jStat } from "jstat";
import type {
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";
import type { AbstractSeries } from "../../series/AbstractSeries";

export type BinomialDistributionCharacteristics = {
  n: number;
  p: number;
};

export const binomial: TheoreticalDistribution<BinomialDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): BinomialDistributionCharacteristics => {
      return {
        n: series.n,
        p: series.mean / series.n,
      };
    },

    getTheoreticalKurtosis: (
      chars: BinomialDistributionCharacteristics,
    ): number => {
      return (
        (1 - 6 * chars.p * (1 - chars.p)) / (chars.n * chars.p * (1 - chars.p))
      );
    },

    getTheoreticalSkewness: (
      chars: BinomialDistributionCharacteristics,
    ): number => {
      return (1 - 2 * chars.p) / Math.sqrt(chars.n * chars.p * (1 - chars.p));
    },

    getStandardMetrics: (
      chars: BinomialDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      const variance = chars.n * chars.p * (1 - chars.p);
      return {
        mean: chars.n * chars.p,
        variance: variance,
        sigma: Math.sqrt(variance),
      };
    },

    // TODO: replace with actual formulas for educational reasons
    cdf: (x: number, { n, p }: BinomialDistributionCharacteristics): number => {
      return jStat.binomial.cdf(x, n, p);
    },

    pdf: (x: number, { n, p }: BinomialDistributionCharacteristics): number => {
      return jStat.binomial.pdf(x, n, p);
    },
  };
