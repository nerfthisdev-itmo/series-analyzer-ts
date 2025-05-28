import { jStat } from "jstat";
import { isIntervalSeries } from "./theoreticalTypes";
import type { VariationSeries } from "../variationSeries";
import type { TheoreticalDistribution } from "./theoreticalTypes";
import type { IntervalVariationSeries } from "../intervalSeries";

export type BinomialDistributionCharacteristics = {
  n: number;
  p: number;
};

export const binomial: TheoreticalDistribution<BinomialDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: IntervalVariationSeries | VariationSeries,
    ): BinomialDistributionCharacteristics => {
      if (isIntervalSeries(series)) {
        return {
          n: series.n,
          p: series.mean / series.n,
        };
      } else {
        return {
          n: series.n,
          p: series.mean / series.n,
        };
      }
    },

    getTheoreticalKurtosis: (
      chars: BinomialDistributionCharacteristics,
    ): number => {
      return (
        (1 - 6 * chars.p * (1 - chars.p)) / (chars.n * chars.p * (1 - chars.p))
      );
    },

    getTheoreticalSkewness: (
      chars: BinomialDistributionCharacteristics,
    ): number => {
      return (1 - 2 * chars.p) / Math.sqrt(chars.n * chars.p * (1 - chars.p));
    },

    getConfidenceIntervals: (
      gamma: number,
      characteristics: BinomialDistributionCharacteristics,
    ): {
      left: BinomialDistributionCharacteristics;
      right: BinomialDistributionCharacteristics;
    } => {
      const getPConfidenceInterval = (): [number, number] => {
        const { n, p } = characteristics;
        const z = jStat.normal.inv(1 - (1 - gamma) / 2, 0, 1);
        const se = Math.sqrt((p * (1 - p)) / n);

        return [Math.max(0, p - z * se), Math.min(1, p + z * se)];
      };

      const [leftP, rightP] = getPConfidenceInterval();

      return {
        left: {
          n: characteristics.n,
          p: leftP,
        },
        right: {
          n: characteristics.n,
          p: rightP,
        },
      };
    },

    calculateTheoreticalFrequencies: (
      characteristics: BinomialDistributionCharacteristics,
      values: Array<number>,
    ): Record<number, number> => {
      const { n: estN, p: estP } = characteristics;
      const frequencies: Record<number, number> = {};

      values.forEach((value) => {
        frequencies[value] =
          jStat.binomial.pdf(value, estN, estP) * characteristics.n;
      });

      return frequencies;
    },
  };
