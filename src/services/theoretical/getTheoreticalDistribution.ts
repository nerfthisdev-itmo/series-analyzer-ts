import { binomial } from "./binomialDistribution";
import { normal } from "./normalDistribution";
import { laplace } from "./laplaceDistribution";
import { geometric } from "./geometricDistribution";
import { uniform } from "./uniformDistribution";
import type { UniformDistributionCharacteristics } from "./uniformDistribution";
import type { GeometricDistributionCharacteristics } from "./geometricDistribution";
import type { LaplaceDistributionCharacteristics } from "./laplaceDistribution";
import type { NormalDistributionCharacteristics } from "./normalDistribution";
import type { BinomialDistributionCharacteristics } from "./binomialDistribution";
import type {
  DistributionType,
  TheoreticalDistribution,
} from "./theoreticalTypes";

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
  type: DistributionType,
): TheoreticalDistribution<
  | NormalDistributionCharacteristics
  | BinomialDistributionCharacteristics
  | LaplaceDistributionCharacteristics
  | GeometricDistributionCharacteristics
  | UniformDistributionCharacteristics
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
  ];
}
