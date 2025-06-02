import { covariance, pearsonCorrelation } from "./correlation";
import type { AbstractSeries } from "../AbstractSeries";

interface RegressionResult {
  a: number; // Intercept
  b: number; // Slope
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
  const b = cov / X.variance;
  const a = meanY - b * meanX;

  const predictedY = X.initial_data.map((xi) => a + b * xi);
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

  const elasticity = b * (meanX / meanY);

  return { a, b, r, R2, mae, elasticity, residuals };
}
