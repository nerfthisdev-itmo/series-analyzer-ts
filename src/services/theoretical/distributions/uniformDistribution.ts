import { jStat } from "jstat";
import type { TheoreticalDistribution } from "../theoreticalTypes";
import type { AbstractSeries } from "../../AbstractSeries";

export type UniformDistributionCharacteristics = {
  a: number;
  b: number;
  n: number;
};

export const uniform: TheoreticalDistribution<UniformDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): UniformDistributionCharacteristics => {
      return {
        a: series.min,
        b: series.max,
        n: series.n,
      };
    },

    getTheoreticalSkewness: () => {
      return 0; // Uniform distribution is symmetric
    },

    getTheoreticalKurtosis: () => {
      return 9 / 5; // Non-excess kurtosis for uniform distribution
    },

    getConfidenceIntervals: (
      gamma: number,
      { a, b, n }: UniformDistributionCharacteristics,
    ): {
      left: UniformDistributionCharacteristics;
      right: UniformDistributionCharacteristics;
    } => {
      // doesnt really apply here idk
      return {
        left: { a, b, n },
        right: { a, b, n },
      };
    },

    cdf: (
      x: number,
      { a, b, n }: UniformDistributionCharacteristics,
    ): number => {
      if (x <= a) return 0;
      if (x >= b) return n;
      return (x - a) / (b - a);
    },

    pdf: (
      x: number,
      { a, b, n }: UniformDistributionCharacteristics,
    ): number => {
      if (x < a || x > b) return 0;
      return 1 / (b - a);
    },
  };
