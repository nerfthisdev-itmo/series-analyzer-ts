import { jStat } from "jstat";
import { studentCoefficient } from "../seriesMath";
import type {
  DistributionCharacteristics,
  TheoreticalDistribution,
} from "./theoreticalTypes";
import type { AbstractSeries } from "../AbstractSeries";

export type NormalDistributionCharacteristics = DistributionCharacteristics & {
  mu: number;
  sigma: number;
};

export const normal: TheoreticalDistribution<NormalDistributionCharacteristics> =
  {
    getCharacteristicsFromEmpiricalData: (
      series: AbstractSeries,
    ): NormalDistributionCharacteristics => {
      return {
        n: series.n,
        mu: series.mean,
        sigma: series.sampleStandardDeviation,
      };
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

    pdf: function (
      x: number,
      { n, mu, sigma }: NormalDistributionCharacteristics,
    ): number {
      return jStat.normal.pdf(x, mu, sigma);
    },
    cdf: function (
      x: number,
      { n, mu, sigma }: NormalDistributionCharacteristics,
    ): number {
      return jStat.normal.cdf(x, mu, sigma);
    },
  };
