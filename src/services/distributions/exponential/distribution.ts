// @ts-ignore types are not developed
import { jStat } from "jstat";
import type { AbstractSeries } from "@/services/series/AbstractSeries";
import type {
  DistributionCharacteristics,
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";

export type ExponentialDistributionCharacteristics =
  DistributionCharacteristics & {
    lambda: number;
  };

export const exponential: TheoreticalDistribution<ExponentialDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): ExponentialDistributionCharacteristics => {
      return {
        n: series.n,
        lambda: 1 / series.mean,
      };
    },

    getTheoreticalKurtosis: (
      _: ExponentialDistributionCharacteristics,
    ): number => {
      return 6;
    },

    getTheoreticalSkewness: (
      _: ExponentialDistributionCharacteristics,
    ): number => {
      return 2;
    },

    getStandardMetrics: (
      chars: ExponentialDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      const mean = 1 / chars.lambda;
      const variance = 1 / chars.lambda ** 2;
      return {
        mean: mean,
        variance: variance,
        sigma: Math.sqrt(variance),
      };
    },

    pdf: function (
      x: number,
      { lambda }: ExponentialDistributionCharacteristics,
    ): number {
      return jStat.exponential.pdf(x, lambda);
    },
    cdf: function (
      x: number,
      { lambda }: ExponentialDistributionCharacteristics,
    ): number {
      return jStat.exponential.cdf(x, lambda);
    },
  };
