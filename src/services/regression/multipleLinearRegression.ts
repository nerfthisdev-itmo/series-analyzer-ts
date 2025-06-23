import { jStat } from "jstat";
import { inv, multiply, transpose } from "mathjs"; // если используется ESM
import { covariance } from "./correlation";
import type { AbstractSeries } from "../series/AbstractSeries";

interface MultipleRegressionResult {
  coefficients: Array<number>; // [b0, b1, b2]
  R2: number;
  adjR2: number;
  fStat: number;
  fPValue: number;
  tStats: Array<number>; // t-статистики для коэффициентов
  vif: Array<number>; // Вариансы инфляции для анализа мультиколлинеарности
  residuals: Array<number>;
}

export function multipleLinearRegression(
  X1: AbstractSeries, // x
  X2: AbstractSeries, // y
  Y: AbstractSeries, // z
): MultipleRegressionResult {
  if (X1.n !== X2.n || X1.n !== Y.n) {
    throw new Error("All series must have the same length");
  }

  const n = X1.n;
  const k = 2; // количество предикторов (x и y)

  // 1. Построение матрицы X = [[1, x_i, y_i]]
  const X = X1.initial_data.map((xi, i) => [1, xi, X2.initial_data[i]]);
  const YVec = Y.initial_data;

  // 2. Вычисление коэффициентов: b = (X^T X)^{-1} X^T Y
  const XT = transpose(X);
  const XTX = multiply(XT, X);
  const XTY = multiply(XT, YVec);
  const invXTX = inv(XTX);
  const coefficients = multiply(invXTX, XTY);

  // 3. Предсказанные значения и остатки
  const predicted = X.map((row) => {
    return (
      coefficients[0] + coefficients[1] * row[1] + coefficients[2] * row[2]
    );
  });
  const residuals = YVec.map((yi, i) => yi - predicted[i]);

  // 4. Вычисление сумм квадратов
  const yMean = Y.mean;
  const SST = YVec.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0); // Total Sum of Squares
  const SSR = predicted.reduce(
    (sum, yPred, i) => sum + (yPred - yMean) ** 2,
    0,
  ); // Regression Sum of Squares
  const SSE = residuals.reduce((sum, r) => sum + r ** 2, 0); // Error Sum of Squares

  // 5. R² и скорректированный R²
  const R2 = SSR / SST;
  const adjR2 = 1 - ((1 - R2) * (n - 1)) / (n - k - 1);

  // 6. F-статистика и p-value
  const fStat = SSR / k / (SSE / (n - k - 1));
  const fPValue = 1 - jStat.snecdf(fStat, k, n - k - 1);

  // 7. t-статистики для коэффициентов
  const MSE = SSE / (n - k - 1);
  const varCoeffs = invXTX.map((row: Array<number>) =>
    row.map((val) => val * MSE),
  );
  const seCoeffs = varCoeffs.map((row: Array<number>) => Math.sqrt(row[0])); // диагональные элементы
  const tStats = coefficients.map((b, i) => b / seCoeffs[i]);
  const tPValues = tStats.map(
    (t) => 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - k - 1)),
  );

  // 8. VIF для анализа мультиколлинеарности
  const vifX1 = calculateVIF(X1, X2);
  const vifX2 = calculateVIF(X2, X1);
  const vif = [vifX1, vifX2];

  return {
    coefficients,
    R2,
    adjR2,
    fStat,
    fPValue,
    tStats,
    vif,
    residuals,
  };
}

// Вспомогательная функция для вычисления VIF
function calculateVIF(X: AbstractSeries, Y: AbstractSeries): number {
  // Построение регрессии X = a + b*Y
  const { k, b } = simpleLinearRegression(Y, X);
  const predicted = Y.initial_data.map((yi) => b + k * yi);
  const residuals = X.initial_data.map((xi, i) => xi - predicted[i]);

  // Вычисление R²
  const SST = X.initial_data.reduce((sum, xi) => sum + (xi - X.mean) ** 2, 0);
  const SSE = residuals.reduce((sum, r) => sum + r ** 2, 0);
  const R2 = 1 - SSE / SST;

  // VIF = 1 / (1 - R²)
  return 1 / (1 - R2);
}

// Простая линейная регрессия для VIF
function simpleLinearRegression(
  X: AbstractSeries,
  Y: AbstractSeries,
): { k: number; b: number } {
  const cov = covariance(X, Y);
  const slope = cov / X.variance;
  const intercept = Y.mean - slope * X.mean;
  return { k: slope, b: intercept };
}
