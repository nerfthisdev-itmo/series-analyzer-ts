import type {
  DistributionCharacteristics,
  TheoreticalDistribution,
} from "../types/distributions";

export function calculateContinuousTheoreticalFrequencies<
  T extends DistributionCharacteristics,
>(
  characteristics: T,
  theory: TheoreticalDistribution<T>,
  intervalBorders: Array<number>,
): Record<string, number> {
  const theoreticalFrequencies: Record<string, number> = {};

  for (let i = 0; i < intervalBorders.length - 1; i++) {
    const lowerBound = intervalBorders[i];
    const upperBound = intervalBorders[i + 1];

    const prob =
      theory.cdf(upperBound, characteristics) -
      theory.cdf(lowerBound, characteristics);
    theoreticalFrequencies[`[${lowerBound}, ${upperBound})`] =
      prob * characteristics.n;
  }
  return theoreticalFrequencies;
}

export function calculateDiscreteTheoreticalFrequencies<
  T extends DistributionCharacteristics,
>(
  characteristics: T,
  theory: TheoreticalDistribution<T>,
  values: Array<number>,
): Record<number, number> {
  const frequencies: Record<number, number> = {};

  values.forEach((value) => {
    frequencies[value] = theory.pdf(value, characteristics) * characteristics.n;
  });

  return frequencies;
}
