import type { VariationSeries } from "../variationSeries";
import type { IntervalVariationSeries } from "../intervalSeries";
import type { TheoreticalDistribution } from "./theoreticalTypes";

export type GeometricDistributionCharacteristics = {
  p: number;
  n: number;
};

export const geometric: TheoreticalDistribution<GeometricDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: VariationSeries | IntervalVariationSeries,
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
      // простейшая оценка по нормальному приближению через delta method
      const z = 1.96; // нормальная квантиль (для gamma ≈ 0.95)
      const se = Math.sqrt((1 - p) / (n * p ** 2)); // стандартная ошибка оценки p
      const delta = z * se;

      return {
        left: { p: Math.max(p - delta, 0.001), n },
        right: { p: Math.min(p + delta, 0.999), n },
      };
    },

    calculateTheoreticalFrequencies: (
      { p, n }: GeometricDistributionCharacteristics,
      borders: Array<number>,
    ): Record<number, number> => {
      const frequencies: Record<number, number> = {};

      const geometricCDF = (k: number): number =>
        1 - Math.pow(1 - p, Math.floor(k));

      for (let i = 0; i < borders.length - 1; i++) {
        const left = borders[i];
        const right = borders[i + 1];
        const mid = (left + right) / 2;
        const prob = geometricCDF(right) - geometricCDF(left);
        frequencies[mid] = prob * n;
      }

      return frequencies;
    },
  };
