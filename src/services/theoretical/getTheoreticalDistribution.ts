import { binomial } from "./binomialDistribution";
import { normal } from "./normalDistribution";
import { laplace } from "./laplaceDistribution";
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
  type: DistributionType,
): TheoreticalDistribution<
  | NormalDistributionCharacteristics
  | BinomialDistributionCharacteristics
  | LaplaceDistributionCharacteristics
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
    default:
      throw new Error(`Unknown distribution type: ${type}`);
  }
}
