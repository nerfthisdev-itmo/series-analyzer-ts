import { jStat } from "jstat";

import type {
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../theoreticalTypes";
import type { AbstractSeries } from "../../AbstractSeries";

export type GeometricDistributionCharacteristics = {
  p: number;
  n: number;
};

export const geometric: TheoreticalDistribution<GeometricDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): GeometricDistributionCharacteristics => {
      // E(X) = 1 / p  →  p = 1 / mean
      const p = 1 / series.mean;
      return {
        p,
        n: series.n,
      };
    },

    getTheoreticalSkewness: ({ p }) => {
      return (2 - p) / Math.sqrt(1 - p);
    },

    getTheoreticalKurtosis: ({ p }) => {
      return 6 + p ** 2 / (1 - p);
    },

    getConfidenceIntervals: (
      gamma: number,
      { p, n }: GeometricDistributionCharacteristics,
    ): {
      left: GeometricDistributionCharacteristics;
      right: GeometricDistributionCharacteristics;
    } => {
      const z = jStat.normal.inv(1 - (1 - gamma) / 2, 0, 1);
      const se = Math.sqrt((1 - p) / (n * p ** 2)); // стандартная ошибка оценки p
      const delta = z * se;

      return {
        left: { p: Math.max(p - delta, 0.001), n },
        right: { p: Math.min(p + delta, 0.999), n },
      };
    },

    getStandardMetrics: (
      chars: GeometricDistributionCharacteristics,
    ): StandardDistributionMetrics => {
      const mean = 1 / chars.p;
      const variance = (1 - chars.p) / chars.p ** 2;
      return {
        mean: mean,
        variance: variance,
        sigma: Math.sqrt(variance),
      };
    },

    cdf: (x: number, { n, p }): number => {
      if (x <= 0) {
        return 0;
      }

      const x_floor = Math.floor(x) + 1;

      return 1 - Math.pow(1 - p, x_floor);
    },

    pdf: (x: number, { n, p }): number => {
      const k = Math.floor(x);

      return Math.pow(1 - p, k) * p;
    },
  };
