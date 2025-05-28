import { jStat } from "jstat";

import { isIntervalSeries } from "../intervalSeries";
import { getAllTheoreticalDistributions } from "./getTheoreticalDistribution";
import {
  calculateContinuousTheoreticalFrequencies,
  calculateDiscreteTheoreticalFrequencies,
} from "./theoreticalFrequencies";
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
  empiricalData: Record<number | string, number>,
  theoreticalData: Record<number | string, number>,
  lowerBound = DISTINCT_CATEGORY_LOWER_BOUND,
): {
  mergedEmpirical: Record<string, number>;
  mergedTheoretical: Record<string, number>;
} {
  function parseKeyString(keyStr: string): { start: number; end: number } {
    if (keyStr.startsWith("[")) {
      const closingBracketIndex = keyStr.lastIndexOf("]");
      const closingParenIndex = keyStr.lastIndexOf(")");
      const endsWith =
        closingBracketIndex > -1 ? "]" : closingParenIndex > -1 ? ")" : "";
      const content = keyStr.substring(
        1,
        keyStr.length - 1 - (endsWith === ")" ? 1 : 0),
      );
      const parts = content.split(",").map((part) => part.trim());
      const start = parseFloat(parts[0]);
      const end = parseFloat(parts[1]);
      return { start, end };
    } else {
      const num = parseFloat(keyStr.toString());
      return { start: num, end: num };
    }
  }

  const mergedEmpirical: Record<string, number> = {};
  const mergedTheoretical: Record<string, number> = {};

  let bufferEmpiricalSum = 0;
  let bufferTheoreticalSum = 0;
  const buffer: Array<{ key_str: string }> = [];

  Object.entries(empiricalData).forEach(([key_str, empiricalValue]) => {
    const theoreticalValue = theoreticalData[key_str] || 0;

    buffer.push({ key_str });
    bufferEmpiricalSum += empiricalValue;
    bufferTheoreticalSum += theoreticalValue;

    if (bufferEmpiricalSum >= lowerBound) {
      const firstKeyStr = buffer[0].key_str;
      const lastKeyStr = buffer[buffer.length - 1].key_str;

      const { start: firstStart } = parseKeyString(firstKeyStr);
      const { end: lastEnd } = parseKeyString(lastKeyStr);

      const mergedKey =
        firstStart === lastEnd
          ? `${firstStart}`
          : `[${firstStart}, ${lastEnd}]`;

      mergedEmpirical[mergedKey] = bufferEmpiricalSum;
      mergedTheoretical[mergedKey] = bufferTheoreticalSum;

      // Reset buffer
      bufferEmpiricalSum = 0;
      bufferTheoreticalSum = 0;
      buffer.length = 0;
    }
  });

  // Handle remaining buffer
  if (buffer.length > 0) {
    if (Object.keys(mergedEmpirical).length > 0) {
      // Merge buffer into the last merged category
      const lastMergedKey = Object.keys(mergedEmpirical).pop()!;
      const { start: lastStart, end: lastEnd } = parseKeyString(lastMergedKey);
      const { start: bufferFirstStart } = parseKeyString(buffer[0].key_str);
      const { end: bufferLastEnd } = parseKeyString(
        buffer[buffer.length - 1].key_str,
      );

      const newStart = lastStart;
      const newEnd = bufferLastEnd;
      const newMergedKey =
        newStart === newEnd ? `${newStart}` : `[${newStart}, ${newEnd}]`;

      mergedEmpirical[newMergedKey] =
        mergedEmpirical[lastMergedKey] + bufferEmpiricalSum;
      mergedTheoretical[newMergedKey] =
        mergedTheoretical[lastMergedKey] + bufferTheoreticalSum;

      delete mergedEmpirical[lastMergedKey];
      delete mergedTheoretical[lastMergedKey];
    } else {
      // Merge all buffer entries into one category
      const firstKeyStr = buffer[0].key_str;
      const lastKeyStr = buffer[buffer.length - 1].key_str;

      const { start: firstStart } = parseKeyString(firstKeyStr);
      const { end: lastEnd } = parseKeyString(lastKeyStr);

      const mergedKey =
        firstStart === lastEnd
          ? `${firstStart}`
          : `[${firstStart}, ${lastEnd}]`;

      mergedEmpirical[mergedKey] = bufferEmpiricalSum;
      mergedTheoretical[mergedKey] = bufferTheoreticalSum;
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
      series.intervalBorders.sort(),
    );
  } else {
    empiricalFreqs = series.getStatisticalSeries();
    theoreticalFreqs = calculateDiscreteTheoreticalFrequencies(
      characteristics,
      theory,
      Object.keys(series.getStatisticalSeries()).map(parseFloat).sort(),
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

  console.log(results);

  return results;
}

export function getBestDistributionTypeByPearson(
  series: AbstractSeries,
): DistributionType | undefined {
  const results = getPearsonForEveryDistributionType(series);

  //   const validResults = results.filter((result) => result.fit.pValue >= 0.05);
  const validResults = results;

  if (validResults.length === 0) {
    console.warn("No distribution passed the Chi-Squared test.");
    return undefined;
  }

  // Step 2: Sort by Chi-Squared (lower is better)
  validResults.sort((a, b) => a.fit.chiSquared - b.fit.chiSquared);

  return validResults[0].type;
}
