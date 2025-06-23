// @ts-ignore types are not developed
import { jStat } from "jstat";

import type {
  DistributionCharacteristics,
  TheoreticalDistribution,
} from "../types/distributions";

export type TestResult = {
  statistic: number;
  criticalValue?: number;
  reject: boolean;
  pValue: number;
  confidenceInterval: [number, number];
};

export function testMean<T extends DistributionCharacteristics>(
  a0: number,
  characteristics: T,
  theory: TheoreticalDistribution<T>,
): TestResult {
  const { mean: x_hat, sigma: s } = theory.getStandardMetrics(characteristics);
  const n = characteristics.n;
  const alpha = 0.05;

  // Рассчет статистики
  const z = (x_hat - a0) / (s / Math.sqrt(n));

  // Определение критического значения и p-value в зависимости от размера выборки
  let criticalValue: number;
  let pValue: number;

  if (n <= 30) {
    // t-распределение Стьюдента для малых выборок
    const df = n - 1; // степени свободы
    criticalValue = jStat.studentt.inv(1 - alpha / 2, df);
    pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(z), df));
  } else {
    // Нормальное распределение для больших выборок
    criticalValue = jStat.normal.inv(1 - alpha / 2, 0, 1);
    pValue = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
  }

  const reject = Math.abs(z) > criticalValue;

  const marginOfError = criticalValue * (s / Math.sqrt(n));
  const confidenceInterval: [number, number] = [
    x_hat - marginOfError,
    x_hat + marginOfError,
  ];

  return {
    statistic: z,
    criticalValue,
    reject,
    pValue,
    confidenceInterval,
  };
}

// Проверка гипотезы о дисперсии (хи-квадрат тест)
export function testVariance<T extends DistributionCharacteristics>(
  sigma0: number,
  characteristics: T,
  theory: TheoreticalDistribution<T>,
): TestResult {
  const { sigma: s } = theory.getStandardMetrics(characteristics);
  const n = characteristics.n;

  const sampleVariance = Math.pow(s, 2);
  const chi2 = ((n - 1) * sampleVariance) / Math.pow(sigma0, 2);
  const alpha = 0.05;
  const chi2Left = jStat.chisquare.inv(alpha / 2, n - 1);
  const chi2Right = jStat.chisquare.inv(1 - alpha / 2, n - 1);
  const reject = chi2 < chi2Left || chi2 > chi2Right;
  const pLeft = jStat.chisquare.cdf(chi2, n - 1);
  const pRight = 1 - pLeft;
  const pValue = 2 * Math.min(pLeft, pRight);

  // Calculate confidence interval for the variance
  const confidenceInterval: [number, number] = [
    ((n - 1) * sampleVariance) / chi2Right,
    ((n - 1) * sampleVariance) / chi2Left,
  ];

  return { statistic: chi2, reject, pValue, confidenceInterval };
}
