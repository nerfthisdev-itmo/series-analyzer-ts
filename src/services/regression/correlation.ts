import type { AbstractSeries } from "../series/AbstractSeries";

// TODO: fix this for interval series to use intervals instead of this cheap hack
export function covariance(X: AbstractSeries, Y: AbstractSeries): number {
  if (X.n !== Y.n) throw new Error("Series must have the same length");
  const meanX = X.mean;
  const meanY = Y.mean;
  let sum = 0;
  for (let i = 0; i < X.n; i++) {
    sum += (X.initial_data[i] - meanX) * (Y.initial_data[i] - meanY);
  }
  return sum / (X.n - 1);
}

export function pearsonCorrelation(
  X: AbstractSeries,
  Y: AbstractSeries,
): number {
  const cov = covariance(X, Y);
  // use corrected one for it to not be biased
  return cov / (X.sampleStandardDeviation * Y.sampleStandardDeviation);
}
