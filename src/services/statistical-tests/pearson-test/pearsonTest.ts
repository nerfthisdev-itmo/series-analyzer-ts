// @ts-ignore types are not developed
import { jStat } from "jstat";
import { mergeCategoriesByLowerBound, parseKeyString } from "./mergeCategories";
import type { AbstractSeries } from "@/services/series/AbstractSeries";
import type {
  DistributionCharacteristics,
  DistributionType,
  TheoreticalDistribution,
} from "@/services/types/distributions";
import { getAllTheoreticalDistributions } from "@/services/types/distributions";
import { isIntervalSeries } from "@/services/series/intervalSeries";
import {
  calculateContinuousTheoreticalFrequencies,
  calculateDiscreteTheoreticalFrequencies,
} from "@/services/distributions/theoreticalFrequencies";

export type PearsonResult = {
  chiSquared: number;
  degreesOfFreedom: number;
  pValue: number;
};

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
      series.intervalBorders,
    );
  } else {
    empiricalFreqs = series.getStatisticalSeries();
    theoreticalFreqs = calculateDiscreteTheoreticalFrequencies(
      characteristics,
      theory,
      Object.keys(empiricalFreqs).map(parseFloat),
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
    sortedTheoretical[key] = theoreticalFreqs[key];
  });

  const { mergedEmpirical, mergedTheoretical } = mergeCategoriesByLowerBound(
    sortedEmpirical,
    sortedTheoretical,
    2,
  );

  const mergedDegreesOfFreedom = getDegreesOfFreedom(
    Object.keys(mergedEmpirical).length,
    characteristics,
  );

  const sortedDegreesOfFreedom = getDegreesOfFreedom(
    Object.keys(sortedEmpirical).length,
    characteristics,
  );

  const finalDegreesOfFreedom =
    mergedDegreesOfFreedom >= 1
      ? mergedDegreesOfFreedom
      : sortedDegreesOfFreedom;

  const chiSquared =
    mergedDegreesOfFreedom >= 1
      ? getChiSquared(mergedEmpirical, mergedTheoretical)
      : getChiSquared(sortedEmpirical, sortedTheoretical);

  const pValue = 1 - jStat.chisquare.cdf(chiSquared, finalDegreesOfFreedom);

  return { chiSquared, degreesOfFreedom: finalDegreesOfFreedom, pValue };
}

function getChiSquared(
  mergedEmpirical: Record<string, number>,
  mergedTheoretical: Record<string, number>,
) {
  let chiSquared = 0;
  for (const key in mergedEmpirical) {
    const o = mergedEmpirical[key] || 0;
    const e = mergedTheoretical[key];
    chiSquared += Math.pow(o - e, 2) / e;
  }
  return chiSquared;
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
  const validResults = results.filter((result) => result.result.pValue > 0.0);
  if (validResults.length === 0) {
    console.warn("No distribution passed the Chi-Squared test.");
    return undefined;
  }
  console.log(results);

  validResults.sort((a, b) => b.result.pValue - a.result.pValue);
  return validResults[0];
}
