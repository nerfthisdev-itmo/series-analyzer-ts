import { binomial } from "../distributions/binomial/distribution";
import { exponential } from "../distributions/exponential/distribution";
import { geometric } from "../distributions/geometric/distribution";
import { laplace } from "../distributions/laplace/distribution";
import { normal } from "../distributions/normal/distribution";
import { poisson } from "../distributions/poisson/distribution";
import { uniform } from "../distributions/uniform/distribution";
import type { UniformDistributionCharacteristics } from "../distributions/uniform/distribution";
import type { PoissonDistributionCharacteristics } from "../distributions/poisson/distribution";
import type { LaplaceDistributionCharacteristics } from "../distributions/laplace/distribution";
import type { NormalDistributionCharacteristics } from "../distributions/normal/distribution";
import type { GeometricDistributionCharacteristics } from "../distributions/geometric/distribution";
import type { ExponentialDistributionCharacteristics } from "../distributions/exponential/distribution";
import type { BinomialDistributionCharacteristics } from "../distributions/binomial/distribution";
import type { AbstractSeries } from "../series/AbstractSeries";

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

export type SomeTheoreticalDistribution =
  | NormalDistributionCharacteristics
  | BinomialDistributionCharacteristics
  | LaplaceDistributionCharacteristics
  | GeometricDistributionCharacteristics
  | UniformDistributionCharacteristics
  | PoissonDistributionCharacteristics
  | ExponentialDistributionCharacteristics;

// Overloads for literal types
export function getTheoreticalDistribution(
  type: "normal",
): TheoreticalDistribution<NormalDistributionCharacteristics>;
export function getTheoreticalDistribution(
  type: "binomial",
): TheoreticalDistribution<BinomialDistributionCharacteristics>;
export function getTheoreticalDistribution(
  type: "laplace",
): TheoreticalDistribution<LaplaceDistributionCharacteristics>;
export function getTheoreticalDistribution(
  type: "laplace",
): TheoreticalDistribution<GeometricDistributionCharacteristics>;
export function getTheoreticalDistribution(
  type: "laplace",
): TheoreticalDistribution<UniformDistributionCharacteristics>;
export function getTheoreticalDistribution(
  type: "poisson",
): TheoreticalDistribution<PoissonDistributionCharacteristics>;
export function getTheoreticalDistribution(
  type: "exponential",
): TheoreticalDistribution<ExponentialDistributionCharacteristics>;

export function getTheoreticalDistribution(
  type: DistributionType,
): TheoreticalDistribution<SomeTheoreticalDistribution>;

// Implementation
export function getTheoreticalDistribution(
  type: DistributionType,
): TheoreticalDistribution<any> {
  switch (type) {
    case "normal":
      return normal;
    case "binomial":
      return binomial;
    case "laplace":
      return laplace;
    case "geometric":
      return geometric;
    case "uniform":
      return uniform;
    case "poisson":
      return poisson;
    case "exponential":
      return exponential;
    default:
      throw new Error(`Unknown distribution type: ${type}`);
  }
}

export function getAllTheoreticalDistributions(): Array<{
  type: DistributionType;
  theory: TheoreticalDistribution<any>;
}> {
  return [
    { type: "normal", theory: normal },
    { type: "binomial", theory: binomial },
    { type: "laplace", theory: laplace },
    { type: "geometric", theory: geometric },
    { type: "uniform", theory: uniform },
    { type: "poisson", theory: poisson },
    { type: "exponential", theory: exponential },
  ];
}
