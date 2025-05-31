import { jStat } from "jstat";
import type { AbstractSeries } from "@/services/AbstractSeries";
import type {
  DistributionCharacteristics,
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../theoreticalTypes";

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

    getConfidenceIntervals: (
      gamma: number,
      characteristics: ExponentialDistributionCharacteristics,
    ): {
      left: ExponentialDistributionCharacteristics;
      right: ExponentialDistributionCharacteristics;
    } => {
      const alpha = 1 - gamma;
      const sumXi = characteristics.n / characteristics.lambda;
      const df = 2 * characteristics.n;
      const chi2Lower = jStat.chisquare.inv(alpha / 2, df);
      const chi2Upper = jStat.chisquare.inv(1 - alpha / 2, df);
      const lowerLambda = chi2Lower / (2 * sumXi);
      const upperLambda = chi2Upper / (2 * sumXi);

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
      { n, lambda }: ExponentialDistributionCharacteristics,
    ): number {
      return jStat.exponential.pdf(x, lambda);
    },
    cdf: function (
      x: number,
      { n, lambda }: ExponentialDistributionCharacteristics,
    ): number {
      return jStat.exponential.cdf(x, lambda);
    },
  };
