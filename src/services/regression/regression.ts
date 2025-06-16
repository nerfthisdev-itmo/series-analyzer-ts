import { covariance, pearsonCorrelation } from "./correlation";
import type { AbstractSeries } from "../series/AbstractSeries";

interface RegressionResult {
  b: number; // Intercept
  k: number; // Slope
  r: number; // Correlation
  R2: number; // Determination
  mae: number; // Mean Approximation Error
  elasticity: number;
  residuals: Array<number>;
}

export function linearRegression(
  X: AbstractSeries,
  Y: AbstractSeries,
): RegressionResult {
  if (X.n !== Y.n) throw new Error("Series must have the same length");
  const meanX = X.mean;
  const meanY = Y.mean;
  const cov = covariance(X, Y);
  const k = cov / X.variance;
  const b = meanY - k * meanX;

  const predictedY = X.initial_data.map((xi) => b + k * xi);
  const residuals = Y.initial_data.map((yi, i) => yi - predictedY[i]);

  const r = pearsonCorrelation(X, Y);
  const R2 = r * r;

  const mae =
    (residuals.reduce(
      (sum, res, i) => sum + Math.abs(res / Y.initial_data[i]),
      0,
    ) /
      X.n) *
    100;

  const elasticity = k * (meanX / meanY);

  return { b, k, r, R2, mae, elasticity, residuals };
}
