import { jStat } from "jstat";

import { isIntervalSeries } from "../intervalSeries";
import { getAllTheoreticalDistributions } from "./getTheoreticalDistribution";
import { calculateContinuousTheoreticalFrequencies } from "./theoreticalFrequencies";
import type { AbstractSeries } from "../AbstractSeries";
import type {
  DistributionCharacteristics,
  DistributionType,
  TheoreticalDistribution,
} from "./theoreticalTypes";

type FitResult = {
  chiSquared: number;
  degreesOfFreedom: number;
  pValue: number;
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

export function PearsonChiSquaredCharacteristic<
  T extends DistributionCharacteristics,
>(series: AbstractSeries, theory: TheoreticalDistribution<T>): FitResult {
  const characteristics = theory.getCharacteristicsFromEmpiricalData(series);

  let theoreticalFreqs: Record<number | string, number> = {};
  let empiricalFreqs: Record<number | string, number> = {};

  if (isIntervalSeries(series)) {
    empiricalFreqs = series.getStatisticalSeries();
    theoreticalFreqs = calculateContinuousTheoreticalFrequencies(
      characteristics,
      theory,
      series.intervalBorders.sort((a, b) => a - b),
    );
  } else {
    empiricalFreqs = series.getStatisticalSeries();
    theoreticalFreqs = calculateContinuousTheoreticalFrequencies(
      characteristics,
      theory,
      Object.keys(series.getStatisticalSeries())
        .map(parseFloat)
        .sort((a, b) => a - b),
    );
  }

  const { mergedEmpirical, mergedTheoretical } = mergeCategoriesByLowerBound(
    empiricalFreqs,
    theoreticalFreqs,
  );

  let chiSquared = 0;

  for (const key in mergedEmpirical) {
    const o = mergedEmpirical[key] || 0;
    const e = mergedTheoretical[key];
    chiSquared += Math.pow(o - e, 2) / e;
  }

  const degreesOfFreedom = getDegreesOfFreedom(
    Object.keys(mergedEmpirical).length,
    characteristics,
  );

  const pValue = 1 - jStat.chisquare.cdf(chiSquared, degreesOfFreedom);

  return {
    chiSquared,
    degreesOfFreedom,
    pValue,
  };
}

export function getPearsonForEveryDistributionType(
  series: AbstractSeries,
): Array<{ type: DistributionType; fit: FitResult }> {
  const results: Array<{ type: DistributionType; fit: FitResult }> = [];
  getAllTheoreticalDistributions().map(({ type, theory }) => {
    results.push({
      type,
      fit: PearsonChiSquaredCharacteristic(series, theory),
    });
  });

  return results;
}

export function getBestDistributionTypeByPearson(series: AbstractSeries) {
  const results = getPearsonForEveryDistributionType(series);

  const validResults = results.filter((result) => result.fit.pValue >= 0.05);

  if (validResults.length === 0) {
    console.warn("No distribution passed the Chi-Squared test.");
    return null;
  }

  // Step 2: Sort by Chi-Squared (lower is better)
  validResults.sort((a, b) => a.fit.chiSquared - b.fit.chiSquared);

  return validResults[0].type;
}
