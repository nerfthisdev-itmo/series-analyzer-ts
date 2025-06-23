import { jStat } from "jstat";
import type { AbstractSeries } from "@/services/series/AbstractSeries";
import type { RegressionResult } from "../regression";

export type RegressionCoefficientsTestResult = {
  k_tStat: number;
  k_pValue: number;
  b_tStat: number;
  b_pValue: number;
  alpha: number;
};

export function testRegressionCoefficients(
  X: AbstractSeries,
  Y: AbstractSeries,
  regression: RegressionResult,
): RegressionCoefficientsTestResult {
  const n = X.n;
  const residuals = regression.residuals.map((value) => value.y);

  // MSE (Mean Squared Error)
  const mse = residuals.reduce((sum, r) => sum + r ** 2, 0) / (n - 2);

  // SE для коэффициента k
  const sumXX = X.initial_data.reduce((sum, xi) => sum + (xi - X.mean) ** 2, 0);
  const seK = Math.sqrt(mse / sumXX);
  const tStatK = regression.k / seK;
  const pValueK = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatK), n - 2));

  // SE для коэффициента b
  const sumX2 = X.initial_data.reduce((sum, xi) => sum + xi ** 2, 0);
  const seB = Math.sqrt((mse * sumX2) / (n * sumXX));
  const tStatB = regression.b / seB;
  const pValueB = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatB), n - 2));

  return {
    k_tStat: tStatK,
    k_pValue: pValueK,
    b_tStat: tStatB,
    b_pValue: pValueB,
    alpha: 0.05,
  };
}
