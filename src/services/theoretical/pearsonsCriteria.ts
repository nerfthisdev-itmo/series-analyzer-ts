import type { AbstractSeries } from "../AbstractSeries";
import { isVariationSeries } from "../variationSeries";
import { calculateContinuousTheoreticalFrequencies } from "./theoreticalFrequencies";
import type {
  DistributionCharacteristics,
  TheoreticalDistribution,
} from "./theoreticalTypes";

type FitResult = {
  chiSquared: number;
  degreesOfFreedom: number;
};
const DISTINCT_CATEGORY_LOWER_BOUND = 5;

export function getNumberOfDistributionParameters<
  T extends DistributionCharacteristics,
>(characteristics: T): number {
  // minus one because there is always the n characteristic
  return Object.keys(characteristics).length - 1;
}

export function getDegreesOfFreedom<T extends DistributionCharacteristics>(
  numberOfDistinctCategories: number,
  characteristics: T,
): number {
  return (
    numberOfDistinctCategories -
    1 -
    getNumberOfDistributionParameters(characteristics)
  );
}

export function mergeCategoriesByLowerBound(
  empiricalData: Record<number, number>,
  theoreticalData: Record<number, number>,
  lowerBound = DISTINCT_CATEGORY_LOWER_BOUND,
): {
  mergedEmpirical: Record<number | string, number>;
  mergedTheoretical: Record<number | string, number>;
} {
  const mergedEmpirical: Record<number | string, number> = {};
  const mergedTheoretical: Record<number | string, number> = {};

  let buffer: Array<{
    key: number | string;
    empiricalValue: number;
    theoreticalValue: number;
  }> = [];

  let bufferSumEmpirical = 0;
  let bufferSumTheoretical = 0;

  Object.entries(empiricalData).forEach(
    ([key_str, value]: [string, number]) => {
      const key = parseFloat(key_str);

      const expectedValue = theoreticalData[key];

      buffer.push({
        key,
        empiricalValue: value,
        theoreticalValue: expectedValue,
      });
      bufferSumEmpirical += value;
      bufferSumTheoretical += expectedValue;

      if (bufferSumEmpirical >= lowerBound) {
        const first = buffer[0].key;
        const last = buffer[buffer.length - 1].key;

        let mergedKey = "";
        if (first === last) {
          mergedKey = `${first}`;
        } else {
          mergedKey = `${first}-${last}`;
        }
        mergedEmpirical[mergedKey] = bufferSumEmpirical;
        mergedTheoretical[mergedKey] = bufferSumTheoretical;
        buffer = [];
        bufferSumEmpirical = 0;
        bufferSumTheoretical = 0;
      }
    },
  );

  if (buffer.length > 0) {
    const lastKey = Object.keys(mergedEmpirical).pop();

    if (lastKey == undefined) {
      const first = Object.keys(empiricalData)[0];
      const last =
        Object.keys(empiricalData)[Object.keys(empiricalData).length - 1];

      mergedEmpirical[`${first}-${last}`] = bufferSumEmpirical;
      mergedTheoretical[`${first}-${last}`] = bufferSumTheoretical;
      return { mergedEmpirical, mergedTheoretical };
    }

    if (lastKey.includes("-")) {
      mergedEmpirical[`${buffer[0].key}+`] = bufferSumEmpirical;
      mergedTheoretical[`${buffer[0].key}+`] = bufferSumTheoretical;
    } else {
      mergedEmpirical[`${lastKey}+`] = bufferSumEmpirical;
      mergedTheoretical[`${lastKey}+`] = bufferSumTheoretical;
    }
  }

  return { mergedEmpirical, mergedTheoretical };
}

// export function PearsonTestDistribution<T extends DistributionCharacteristics>(
//   empiricalSeries: AbstractSeries,
//   theory: TheoreticalDistribution<T>,
// ): FitResult {
//   const characteristics =
//     theory.getCharacteristicsFromEmpiricalData(empiricalSeries);

//   let theoreticalFreqs: Record<number | string, number> = {};
//   let observedFreqs: Record<number | string, number> = {};

//   if (isVariationSeries(empiricalSeries)) {
//     observedFreqs = empiricalSeries.getStatisticalSeries();
//     theoreticalFreqs = calculateContinuousTheoreticalFrequencies(
//       characteristics,
//       theory,
//     );
//   }

//   // Step 4: Compute chi-squared
//   let chiSquared = 0;
//   let k = 0; // Number of intervals

//   for (const key in theoreticalFreqs) {
//     const o = observedFreqs[key] || 0;
//     const e = theoreticalFreqs[key];
//     chiSquared += Math.pow(o - e, 2) / e;
//     k++;
//   }

//   // Step 5: Degrees of freedom
//   const df = getDegreesOfFreedom(k, characteristics);

//   return {
//     chiSquared,
//     degreesOfFreedom: df,
//   };
// }
