import { studentCoefficient } from "../variationSeries";
import { isIntervalSeries } from "./theoreticalTypes";
import type { VariationSeries } from "../variationSeries";
import type { TheoreticalDistribution } from "./theoreticalTypes";
import type { IntervalVariationSeries } from "../intervalSeries";
import { jStat } from "jstat";

export type BinomialDistributionCharacteristics = {
  n: number;
  p: number;
};

export const normal: TheoreticalDistribution<BinomialDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: IntervalVariationSeries | VariationSeries,
    ): BinomialDistributionCharacteristics => {
      if (isIntervalSeries(series)) {
        return {
          n: series.n,
          p: series.expectedValue / series.n,
        };
      } else {
        return {
          n: series.n,
          p: series.expectedValueEstimate / series.n,
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
      const getNormalMeanCI = (): [number, number] => {
        const t = studentCoefficient(gamma, characteristics.n);
        const margin =
          (t * characteristics.sigma) / Math.sqrt(characteristics.n);
        return [characteristics.mu - margin, characteristics.mu + margin];
      };

      const getNormalVarianceCI = (): [number, number] => {
        const alpha = 1 - gamma;
        const variance = characteristics.sigma * characteristics.sigma;
        const chi2 = (p: number) =>
          jStat.chisquare.inv(p, characteristics.n - 1);
        return [
          ((characteristics.n - 1) * variance) / chi2(1 - alpha / 2),
          ((characteristics.n - 1) * variance) / chi2(alpha / 2),
        ];
      };

      const [leftMean, rightMean] = getNormalMeanCI();
      const [leftVariance, rightVariance] = getNormalVarianceCI();

      return {
        left: {
          n: characteristics.n,
          mu: leftMean,
          sigma: leftVariance,
        },
        right: {
          n: characteristics.n,
          mu: rightMean,
          sigma: rightVariance,
        },
      };
    },
  };
