import { binomial } from "./distributions/binomialDistribution";
import { normal } from "./distributions/normalDistribution";
import { laplace } from "./distributions/laplaceDistribution";
import { geometric } from "./distributions/geometricDistribution";
import { uniform } from "./distributions/uniformDistribution";
import { poisson } from "./distributions/poissonDistribution";
import type { PoissonDistributionCharacteristics } from "./distributions/poissonDistribution";
import type { UniformDistributionCharacteristics } from "./distributions/uniformDistribution";
import type { GeometricDistributionCharacteristics } from "./distributions/geometricDistribution";
import type { LaplaceDistributionCharacteristics } from "./distributions/laplaceDistribution";
import type { NormalDistributionCharacteristics } from "./distributions/normalDistribution";
import type { BinomialDistributionCharacteristics } from "./distributions/binomialDistribution";
import type {
  DistributionType,
  TheoreticalDistribution,
} from "./theoreticalTypes";
import {
  exponential,
  type ExponentialDistributionCharacteristics,
} from "./distributions/exponentialDistribution";

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
): TheoreticalDistribution<
  | NormalDistributionCharacteristics
  | BinomialDistributionCharacteristics
  | LaplaceDistributionCharacteristics
  | GeometricDistributionCharacteristics
  | UniformDistributionCharacteristics
  | PoissonDistributionCharacteristics
  | ExponentialDistributionCharacteristics
>;

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
