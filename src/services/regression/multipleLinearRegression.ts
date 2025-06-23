// @ts-ignore types are not developed
import { jStat } from "jstat";
import { inv, multiply, transpose } from "mathjs";
import { covariance } from "./correlation";
import type { AbstractSeries } from "../series/AbstractSeries";

export type MultipleRegressionCoefficients = {
  intercept: number;
  x1: number;
  x2: number;
};

export type MultipleRegressionResult = {
  coefficients: MultipleRegressionCoefficients;
  R2: number;
  adjR2: number;
  fStat: number;
  fPValue: number;
  tStats: MultipleRegressionCoefficients;
  tPValues: MultipleRegressionCoefficients;
  vif: { x1: number; x2: number };
  residuals: Array<{ x1: number; x2: number; y: number }>;
};

export function multipleLinearRegression(
  X1: AbstractSeries,
  X2: AbstractSeries,
  Y: AbstractSeries,
): MultipleRegressionResult {
  if (X1.n !== X2.n || X1.n !== Y.n) {
    throw new Error("All series must have the same length");
  }

  const n = X1.n;
  const k = 2;

  // Design matrix
  const X = X1.initial_data.map((xi, i) => [1, xi, X2.initial_data[i]]);
  const YVec = Y.initial_data;

  // Matrix operations
  const XT = transpose(X);
  const XTX = multiply(XT, X);
  const XTY = multiply(XT, YVec);
  const invXTX = inv(XTX);
  const coeffArray = multiply(invXTX, XTY);

  // Create coefficients object
  const coefficients = {
    intercept: coeffArray[0],
    x1: coeffArray[1],
    x2: coeffArray[2],
  };

  // Predicted values and residuals
  const predicted = X.map(
    (row) =>
      coefficients.intercept +
      coefficients.x1 * row[1] +
      coefficients.x2 * row[2],
  );
  const residuals = YVec.map((yi, i) => yi - predicted[i]);

  // Sums of squares
  const yMean = Y.mean;
  const SST = YVec.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0);
  const SSR = predicted.reduce((sum, yPred) => sum + (yPred - yMean) ** 2, 0);
  const SSE = residuals.reduce((sum, r) => sum + r ** 2, 0);

  // R² calculations
  const R2 = SSR / SST;
  const adjR2 = 1 - ((1 - R2) * (n - 1)) / (n - k - 1);

  // F-statistic
  const fStat = SSR / k / (SSE / (n - k - 1));
  const fPValue = jStat.ftest(fStat, k, n - k - 1);

  // Standard errors and t-stats
  const MSE = SSE / (n - k - 1);
  const varCovMatrix = invXTX.map((row: Array<number>) =>
    row.map((val) => val * MSE),
  );

  const seIntercept = Math.sqrt(varCovMatrix[0][0]);
  const seX1 = Math.sqrt(varCovMatrix[1][1]);
  const seX2 = Math.sqrt(varCovMatrix[2][2]);

  const tStatIntercept = coefficients.intercept / seIntercept;
  const tStatX1 = coefficients.x1 / seX1;
  const tStatX2 = coefficients.x2 / seX2;

  const df = n - k - 1;
  const tPValueIntercept =
    2 * (1 - jStat.studentt.cdf(Math.abs(tStatIntercept), df));
  const tPValueX1 = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatX1), df));
  const tPValueX2 = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatX2), df));

  // VIF calculations
  const vifX1 = calculateVIF(X1, X2);
  const vifX2 = calculateVIF(X2, X1);

  return {
    coefficients,
    R2,
    adjR2,
    fStat,
    fPValue,
    tStats: {
      intercept: tStatIntercept,
      x1: tStatX1,
      x2: tStatX2,
    },
    tPValues: {
      intercept: tPValueIntercept,
      x1: tPValueX1,
      x2: tPValueX2,
    },
    vif: { x1: vifX1, x2: vifX2 },
    residuals: residuals.map((_, i) => {
      return {
        x1: X1.initial_data[i],
        x2: X2.initial_data[i],
        y: Y.initial_data[i],
      };
    }),
  };
}

// Helper function to calculate VIF
function calculateVIF(X: AbstractSeries, Y: AbstractSeries): number {
  const { slope, intercept } = simpleLinearRegression(Y, X);
  const predicted = Y.initial_data.map((yi) => intercept + slope * yi);
  const residuals = X.initial_data.map((xi, i) => xi - predicted[i]);

  const SST = X.initial_data.reduce((sum, xi) => sum + (xi - X.mean) ** 2, 0);
  const SSE = residuals.reduce((sum, r) => sum + r ** 2, 0);
  const R2 = 1 - SSE / SST;

  return R2 === 1 ? Infinity : 1 / (1 - R2);
}

// Simple linear regression for VIF
function simpleLinearRegression(
  X: AbstractSeries,
  Y: AbstractSeries,
): { slope: number; intercept: number } {
  const cov = covariance(X, Y);
  const slope = cov / X.variance;
  const intercept = Y.mean - slope * X.mean;
  return { slope, intercept };
}
