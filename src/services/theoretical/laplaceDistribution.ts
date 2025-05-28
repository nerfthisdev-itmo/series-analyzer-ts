import { jStat } from "jstat";
import type { TheoreticalDistribution } from "./theoreticalTypes";
import type { AbstractSeries } from "../AbstractSeries";

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

    getConfidenceIntervals: (
      gamma: number,
      characteristics: LaplaceDistributionCharacteristics,
    ): {
      left: LaplaceDistributionCharacteristics;
      right: LaplaceDistributionCharacteristics;
    } => {
      const z = jStat.normal.inv((1 + gamma) / 2, 0, 1);
      const margin = (z * characteristics.b) / Math.sqrt(characteristics.n);

      return {
        left: {
          mu: characteristics.mu - margin,
          b: characteristics.b,
          n: characteristics.n,
        },
        right: {
          mu: characteristics.mu + margin,
          b: characteristics.b,
          n: characteristics.n,
        },
      };
    },

    cdf: (x: number, { mu, b }: LaplaceDistributionCharacteristics): number => {
      if (x < mu) {
        return 0.5 * Math.exp((x - mu) / b);
      } else {
        return 1 - 0.5 * Math.exp(-(x - mu) / b);
      }
    },

    pdf: (x: number, { mu, b }: LaplaceDistributionCharacteristics): number => {
      return (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
    },
  };
