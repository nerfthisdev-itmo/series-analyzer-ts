// @ts-ignore types are not developed
import { jStat } from "jstat";

import type {
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "../../types/distributions";
import type { AbstractSeries } from "../../series/AbstractSeries";

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

    getTheoreticalExcess: ({ p }) => {
      return 6 + p ** 2 / (1 - p);
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

    cdf: (x: number, { p }): number => {
      if (x <= 0) {
        return 0;
      }

      const x_floor = Math.floor(x) + 1;

      return 1 - Math.pow(1 - p, x_floor);
    },

    pdf: (x: number, { p }): number => {
      const k = Math.floor(x);

      return Math.pow(1 - p, k) * p;
    },
  };
