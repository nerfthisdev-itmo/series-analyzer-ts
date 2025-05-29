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

export type TheoreticalDistribution<T extends DistributionCharacteristics> = {
  getCharacteristicsFromEmpiricalData: (series: AbstractSeries) => T;

  getTheoreticalKurtosis: (characteristics: T) => number;

  getTheoreticalSkewness: (characteristics: T) => number;

  getConfidenceIntervals: (
    gamma: number,
    characteristics: T,
  ) => {
    left: T;
    right: T;
  };

  pdf: (x: number, characteristics: T) => number;
  cdf: (x: number, characteristics: T) => number;
};
