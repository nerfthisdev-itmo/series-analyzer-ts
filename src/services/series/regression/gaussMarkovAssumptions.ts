import type { AbstractSeries } from "../AbstractSeries";

export function analyzeResiduals(residuals: AbstractSeries) {
  const meanResidual = residuals.mean;
  const zeroMean = Math.abs(meanResidual) < 1e-6;

  const skewness = residuals.skewness;
  const kurtosis = residuals.kurtosis;

  let dw = 0;
  for (let i = 1; i < residuals.initial_data.length; i++) {
    dw += (residuals.initial_data[i] - residuals.initial_data[i - 1]) ** 2;
  }
  const durbinWatson =
    dw / residuals.initial_data.reduce((sum, r) => sum + r ** 2, 0);

  return { zeroMean, skewness, kurtosis, durbinWatson };
}
