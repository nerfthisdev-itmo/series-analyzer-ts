// @ts-ignore types are not developed
import { jStat } from "jstat";
import type {
  DistributionCharacteristics,
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";
import type { AbstractSeries } from "../../series/AbstractSeries";

export type NormalDistributionCharacteristics = DistributionCharacteristics & {
  mu: number;
  sigma: number;
};

export const normal: TheoreticalDistribution<NormalDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): NormalDistributionCharacteristics => {
      return {
        n: series.n,
        mu: series.mean,
        sigma: series.standardDeviation,
      };
    },

    getTheoreticalExcess: (_: NormalDistributionCharacteristics): number => {
      return 0;
    },

    getTheoreticalSkewness: (_: NormalDistributionCharacteristics): number => {
      return 0;
    },

    getStandardMetrics: (
      chars: NormalDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      return {
        mean: chars.mu,
        variance: chars.sigma ** 2,
        sigma: chars.sigma,
      };
    },

    pdf: function (
      x: number,
      { mu, sigma }: NormalDistributionCharacteristics,
    ): number {
      return jStat.normal.pdf(x, mu, sigma);
    },
    cdf: function (
      x: number,
      { mu, sigma }: NormalDistributionCharacteristics,
    ): number {
      return jStat.normal.cdf(x, mu, sigma);
    },
  };
