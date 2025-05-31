import type { AbstractSeries } from "../AbstractSeries";

export type DistributionType =
  | "normal"
  | "binomial"
  | "poisson"
  | "laplace"
  | "geometric"
  | "uniform"
  | "exponential";
export type DistributionPair = [DistributionType, DistributionType];

export type DistributionCharacteristics = {
  n: number;
};

export type StandardDistributionMetrics = {
  mean: number;
  variance: number;
  sigma: number;
};

export type TheoreticalDistribution<T extends DistributionCharacteristics> = {
  getCharacteristicsFromEmpiricalData: (series: AbstractSeries) => T;

  getTheoreticalKurtosis: (characteristics: T) => number;

  getTheoreticalSkewness: (characteristics: T) => number;

  getStandardMetrics: (characteristics: T) => StandardDistributionMetrics;

  pdf: (x: number, characteristics: T) => number;
  cdf: (x: number, characteristics: T) => number;
};
