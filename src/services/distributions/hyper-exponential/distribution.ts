import type { AbstractSeries } from "@/services/series/AbstractSeries";
import type {
  DistributionCharacteristics,
  StandardDistributionMetrics,
  TheoreticalDistribution,
} from "@/services/types/distributions";

export type HyperExponentialDistributionCharacteristics =
  DistributionCharacteristics & {
    p: number; // mixing probability (0 < p < 1)
    lambda1: number; // rate of first exponential component (> 0)
    lambda2: number; // rate of second exponential component (> 0)
  };

export const hyperExponential: TheoreticalDistribution<HyperExponentialDistributionCharacteristics> =
  {
    /**
     * Estimate p, lambda1, lambda2 from empirical data using method of moments.
     * We fix lambda1 (or a = 1/lambda1) heuristically and solve for the rest.
     */
    getCharacteristicsFromEmpiricalData(
      series: AbstractSeries,
    ): HyperExponentialDistributionCharacteristics {
      const mu = series.mean;
      const sigma2 = series.variance;

      if (mu <= 0 || sigma2 <= 0) {
        throw new Error(
          "Data must be positive with positive variance for HyperExponential fitting.",
        );
      }

      // Heuristic: choose a = 1/lambda1 as a fraction of the mean
      // Common choice: a = mu / 3 (so lambda1 = 3 / mu)
      const a = mu / 3;
      const lambda1 = 1 / a;

      // Compute M = (sigma^2 + mu^2) / 2
      const M = (sigma2 + mu * mu) / 2;

      // Coefficients for quadratic in b = 1/lambda2
      const A = mu - a;
      const B = a * a - M;
      const C = M * a - a * a * mu;

      // Solve A * b^2 + B * b + C = 0
      const discriminant = B * B - 4 * A * C;
      if (discriminant < 0) {
        throw new Error("Cannot fit HyperExponential: discriminant negative.");
      }

      const sqrtD = Math.sqrt(discriminant);
      const b1 = (-B + sqrtD) / (2 * A);
      const b2 = (-B - sqrtD) / (2 * A);

      // Choose root b > mu (the "slow" component)
      const b = b1 > mu ? b1 : b2 > mu ? b2 : b1; // fallback if both > mu or none

      if (b <= 0) {
        throw new Error("Invalid root for b in HyperExponential fitting.");
      }

      const lambda2 = 1 / b;
      const p = (b - mu) / (b - a);

      // Clamp p to (0, 1) to avoid numerical issues
      const clampedP = Math.min(Math.max(p, 0.01), 0.99);

      return { p: clampedP, lambda1, lambda2, n: series.n };
    },

    /**
     * Theoretical kurtosis of HyperExponential distribution.
     * Formula derived from raw moments.
     */
    getTheoreticalExcess(
      char: HyperExponentialDistributionCharacteristics,
    ): number {
      const { p, lambda1, lambda2 } = char;
      const q = 1 - p;

      // Raw moments: E[X^n] = n! * (p / lambda1^n + q / lambda2^n)
      const mu1 = p / lambda1 + q / lambda2;
      const mu2 = 2 * (p / lambda1 ** 2 + q / lambda2 ** 2);
      const mu3 = 6 * (p / lambda1 ** 3 + q / lambda2 ** 3);
      const mu4 = 24 * (p / lambda1 ** 4 + q / lambda2 ** 4);

      const variance = mu2 - mu1 ** 2;
      const sigma = Math.sqrt(variance);

      //   const skewness = (mu3 - 3 * mu1 * variance - mu1 ** 3) / sigma ** 3;
      const kurtosisExcess =
        (mu4 - 4 * mu1 * mu3 + 6 * mu1 ** 2 * mu2 - 3 * mu1 ** 4) / sigma ** 4 -
        3;

      return kurtosisExcess;
    },

    /**
     * Theoretical skewness.
     */
    getTheoreticalSkewness(
      char: HyperExponentialDistributionCharacteristics,
    ): number {
      const { p, lambda1, lambda2 } = char;
      const q = 1 - p;

      const mu1 = p / lambda1 + q / lambda2;
      const mu2 = 2 * (p / lambda1 ** 2 + q / lambda2 ** 2);
      const mu3 = 6 * (p / lambda1 ** 3 + q / lambda2 ** 3);

      const variance = mu2 - mu1 ** 2;
      const sigma = Math.sqrt(variance);

      return (mu3 - 3 * mu1 * variance - mu1 ** 3) / sigma ** 3;
    },

    /**
     * Return standard metrics: mean, variance, std dev.
     */
    getStandardMetrics(
      char: HyperExponentialDistributionCharacteristics,
    ): StandardDistributionMetrics {
      const { p, lambda1, lambda2 } = char;
      const q = 1 - p;

      const mean = p / lambda1 + q / lambda2;
      const secondMoment = 2 * (p / lambda1 ** 2 + q / lambda2 ** 2);
      const variance = secondMoment - mean ** 2;
      const sigma = Math.sqrt(variance);

      return { mean, variance, sigma };
    },

    /**
     * Probability density function (PDF).
     */
    pdf(x: number, char: HyperExponentialDistributionCharacteristics): number {
      if (x < 0) return 0;
      const { p, lambda1, lambda2 } = char;
      return (
        p * lambda1 * Math.exp(-lambda1 * x) +
        (1 - p) * lambda2 * Math.exp(-lambda2 * x)
      );
    },

    /**
     * Cumulative distribution function (CDF).
     */
    cdf(x: number, char: HyperExponentialDistributionCharacteristics): number {
      if (x < 0) return 0;
      const { p, lambda1, lambda2 } = char;
      return (
        p * (1 - Math.exp(-lambda1 * x)) +
        (1 - p) * (1 - Math.exp(-lambda2 * x))
      );
    },
  };
