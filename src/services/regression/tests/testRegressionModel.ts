import { jStat } from "jstat";

import type { AbstractSeries } from "@/services/series/AbstractSeries";
import type { RegressionResult } from "../regression";

export type FTestResult = {
  fStat: number;
  pValue: number;
  dfModel: number;
  dfResidual: number;
  alpha: number;
};

export function testRegressionModel(
  X: AbstractSeries,
  Y: AbstractSeries,
  regression: RegressionResult,
): FTestResult {
  const n = X.n;
  const predictedY = X.initial_data.map(
    (xi) => regression.b + regression.k * xi,
  );

  // SSR (Sum of Squares due to Regression)
  const ssr = predictedY.reduce(
    (sum, yPred, i) => sum + (yPred - Y.mean) ** 2,
    0,
  );

  // SSE (Sum of Squared Errors)
  const sse = regression.residuals.reduce((sum, r) => sum + r ** 2, 0);

  // F-статистика
  const fStat = ssr / 1 / (sse / (n - 2));
  const pValue = 1 - jStat.ftest(fStat, 1, n - 2); // F-распределение

  return {
    fStat,
    pValue,
    dfModel: 1,
    dfResidual: n - 2,
    alpha: 0.05,
  };
}
