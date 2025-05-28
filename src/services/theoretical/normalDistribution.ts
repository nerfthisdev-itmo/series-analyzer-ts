import { jStat } from "jstat";
import { studentCoefficient } from "../seriesMath";
import { isIntervalSeries } from "./theoreticalTypes";
import type { VariationSeries } from "../variationSeries";
import type { TheoreticalDistribution } from "./theoreticalTypes";
import type { IntervalVariationSeries } from "../intervalSeries";

export type NormalDistributionCharacteristics = {
  n: number;
  mu: number;
  sigma: number;
};

export const normal: TheoreticalDistribution<NormalDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: IntervalVariationSeries | VariationSeries,
    ): NormalDistributionCharacteristics => {
      if (isIntervalSeries(series)) {
        return {
          n: series.n,
          mu: series.mean,
          sigma: series.sampleStandardDeviation,
        };
      } else {
        return {
          n: series.n,
          mu: series.mean,
          sigma: series.sampleStandardDeviation,
        };
      }
    },

    getTheoreticalKurtosis: (_: NormalDistributionCharacteristics): number => {
      return 0;
    },

    getTheoreticalSkewness: (_: NormalDistributionCharacteristics): number => {
      return 0;
    },

    getConfidenceIntervals: (
      gamma: number,
      characteristics: NormalDistributionCharacteristics,
    ): {
      left: NormalDistributionCharacteristics;
      right: NormalDistributionCharacteristics;
    } => {
      const getNormalMeanCI = (): [number, number] => {
        const t = studentCoefficient(gamma, characteristics.n);
        const margin =
          (t * characteristics.sigma) / Math.sqrt(characteristics.n);
        return [characteristics.mu - margin, characteristics.mu + margin];
      };

      const getNormalStandardDeviationCI = (): [number, number] => {
        const alpha = 1 - gamma;
        const chi2 = (p: number) =>
          jStat.chisquare.inv(p, characteristics.n - 1);
        return [
          ((characteristics.n - 1) * characteristics.sigma) /
            chi2(1 - alpha / 2),
          ((characteristics.n - 1) * characteristics.sigma) / chi2(alpha / 2),
        ];
      };

      const [leftMean, rightMean] = getNormalMeanCI();
      const [leftVariance, rightVariance] = getNormalStandardDeviationCI();

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
    calculateTheoreticalFrequencies: (
      chars: NormalDistributionCharacteristics,
      borders: Array<number>,
    ): Record<number, number> => {
      const theoreticalFrequencies: Record<number, number> = [];

      const normalCdf = (x: number, mu: number, sigma: number): number => {
        return jStat.normal.cdf(x, mu, sigma);
      };

      for (let i = 0; i < borders.length - 1; i++) {
        const lowerBound = borders[i];
        const upperBound = borders[i + 1];
        // Расчет теоретической частоты для интервала в нормальном распределении
        const prob =
          normalCdf(upperBound, chars.mu, chars.sigma) -
          normalCdf(lowerBound, chars.mu, chars.sigma);
        theoreticalFrequencies[(lowerBound + upperBound) / 2] = prob * chars.n;
      }

      return theoreticalFrequencies;
    },
  };
