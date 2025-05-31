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

export type PearsonResult = {
  chiSquared: number;
  degreesOfFreedom: number;
  pValue: number;
};

const DISTINCT_CATEGORY_LOWER_BOUND = 5;

export function getNumberOfDistributionParameters<
  T extends DistributionCharacteristics,
>(characteristics: T): number {
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

export function mergeCategoriesByLowerBound(
  empiricalData: Record<string, number>,
  theoreticalData: Record<string, number>,
  lowerBound = DISTINCT_CATEGORY_LOWER_BOUND,
): {
  mergedEmpirical: Record<string, number>;
  mergedTheoretical: Record<string, number>;
} {
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

    if (bufferTheoreticalSum >= lowerBound) {
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
      const lastMergedKey = Object.keys(mergedEmpirical).pop()!;
      const { start: lastStart } = parseKeyString(lastMergedKey);
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

  // Final validation: ensure all theoretical frequencies ≥ 5
  for (const key in mergedTheoretical) {
    if (mergedTheoretical[key] < DISTINCT_CATEGORY_LOWER_BOUND) {
      console.warn(
        `Expected frequency for category "${key}" is below threshold: ${mergedTheoretical[key]}.`,
      );
    }
  }

  return { mergedEmpirical, mergedTheoretical };
}

export function PearsonChiSquaredCharacteristic<
  T extends DistributionCharacteristics,
>(series: AbstractSeries, theory: TheoreticalDistribution<T>): PearsonResult {
  const characteristics = theory.getCharacteristicsFromEmpiricalData(series);

  let theoreticalFreqs: Record<string, number> = {};
  let empiricalFreqs: Record<string, number> = {};

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
      Object.keys(empiricalFreqs)
        .map(parseFloat)
        .sort((a, b) => a - b),
    );
  }

  // Sort empirical and theoretical keys by numeric interval start
  const sortedKeys = Object.keys(empiricalFreqs).sort(
    (a, b) => parseKeyString(a).start - parseKeyString(b).start,
  );

  const sortedEmpirical: Record<string, number> = {};
  const sortedTheoretical: Record<string, number> = {};

  sortedKeys.forEach((key) => {
    sortedEmpirical[key] = empiricalFreqs[key];
    sortedTheoretical[key] = theoreticalFreqs[key] || 0;
  });

  const { mergedEmpirical, mergedTheoretical } = mergeCategoriesByLowerBound(
    sortedEmpirical,
    sortedTheoretical,
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

  return { chiSquared, degreesOfFreedom, pValue };
}

export function getPearsonForEveryDistributionType(
  series: AbstractSeries,
): Array<{ type: DistributionType; result: PearsonResult }> {
  const results: Array<{ type: DistributionType; result: PearsonResult }> = [];
  getAllTheoreticalDistributions().forEach(({ type, theory }) => {
    results.push({
      type,
      result: PearsonChiSquaredCharacteristic(series, theory),
    });
  });

  return results;
}

export function getBestDistributionTypeByPearson(
  series: AbstractSeries,
): { type: DistributionType; result: PearsonResult } | undefined {
  const results = getPearsonForEveryDistributionType(series);

  // Filter only distributions with p-value ≥ 0.05
  const validResults = results.filter((result) => result.result.pValue >= 0.05);

  if (validResults.length === 0) {
    console.warn("No distribution passed the Chi-Squared test.");
    return undefined;
  }

  // Select best by highest p-value
  validResults.sort((a, b) => b.result.chiSquared - a.result.chiSquared);

  return validResults[0];
}
