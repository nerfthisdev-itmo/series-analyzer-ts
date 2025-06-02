import { jStat } from "jstat";
import type {
  DistributionCharacteristics,
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";
import type { AbstractSeries } from "../../series/AbstractSeries";

export type PoissonDistributionCharacteristics = DistributionCharacteristics & {
  lambda: number;
};

export const poisson: TheoreticalDistribution<PoissonDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): PoissonDistributionCharacteristics => {
      return {
        n: series.n,
        lambda: series.mean,
      };
    },

    getTheoreticalKurtosis: (
      characteristics: PoissonDistributionCharacteristics,
    ): number => {
      return 1 / characteristics.lambda;
    },

    getTheoreticalSkewness: (
      characteristics: PoissonDistributionCharacteristics,
    ): number => {
      return 1 / Math.sqrt(characteristics.lambda);
    },

    getStandardMetrics: (
      chars: PoissonDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      return {
        mean: chars.lambda,
        variance: chars.lambda,
        sigma: Math.sqrt(chars.lambda),
      };
    },

    pdf: function (
      x: number,
      { n, lambda }: PoissonDistributionCharacteristics,
    ): number {
      return jStat.poisson.pdf(x, lambda);
    },
    cdf: function (
      x: number,
      { n, lambda }: PoissonDistributionCharacteristics,
    ): number {
      return jStat.poisson.cdf(x, lambda);
    },
  };
