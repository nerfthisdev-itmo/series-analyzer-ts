import { binomial } from "./binomialDistribution";
import { normal } from "./normalDistribution";
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
  type: DistributionType,
): TheoreticalDistribution<
  NormalDistributionCharacteristics | BinomialDistributionCharacteristics
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
    default:
      throw new Error(`Unknown distribution type: ${type}`);
  }
}
