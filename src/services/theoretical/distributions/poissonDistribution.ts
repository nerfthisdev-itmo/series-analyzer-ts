import { jStat } from "jstat";
import type {
  DistributionCharacteristics,
  TheoreticalDistribution,
} from "../theoreticalTypes";
import type { AbstractSeries } from "../../AbstractSeries";

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

    getConfidenceIntervals: (
      gamma: number,
      characteristics: PoissonDistributionCharacteristics,
    ): {
      left: PoissonDistributionCharacteristics;
      right: PoissonDistributionCharacteristics;
    } => {
      const alpha = 1 - gamma;
      const Y_total = characteristics.lambda * characteristics.n;
      const chi2Lower = jStat.chisquare.inv(alpha / 2, 2 * Y_total);
      const chi2Upper = jStat.chisquare.inv(1 - alpha / 2, 2 * (Y_total + 1));
      const lowerLambda = chi2Lower / (2 * characteristics.n);
      const upperLambda = chi2Upper / (2 * characteristics.n);

      return {
        left: {
          n: characteristics.n,
          lambda: lowerLambda,
        },
        right: {
          n: characteristics.n,
          lambda: upperLambda,
        },
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
