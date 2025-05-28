import { jStat } from "jstat";
import type { IntervalVariationSeries } from "../intervalSeries";
import type { VariationSeries } from "../variationSeries";
import type { TheoreticalDistribution } from "./theoreticalTypes";

export type LaplaceDistributionCharacteristics = {
  mu: number;
  b: number;
  n: number;
};

export const laplace: TheoreticalDistribution<LaplaceDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: VariationSeries | IntervalVariationSeries,
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

    calculateTheoreticalFrequencies: (
      { mu, b, n }: LaplaceDistributionCharacteristics,
      borders: Array<number>,
    ): Record<number, number> => {
      const frequencies: Record<number, number> = {};

      const laplaceCDF = (x: number): number =>
        x < mu
          ? 0.5 * Math.exp((x - mu) / b)
          : 1 - 0.5 * Math.exp(-(x - mu) / b);

      for (let i = 0; i < borders.length - 1; i++) {
        const left = borders[i];
        const right = borders[i + 1];
        const mid = (left + right) / 2;
        const p = laplaceCDF(right) - laplaceCDF(left);
        frequencies[mid] = p * n;
      }

      return frequencies;
    },
  };
