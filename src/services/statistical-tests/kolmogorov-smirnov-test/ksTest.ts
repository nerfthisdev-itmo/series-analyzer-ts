import { approximateKSPValue } from "./approx";
import type { AbstractSeries } from "@/services/series/AbstractSeries";
import type {
  DistributionCharacteristics,
  DistributionType,
  TheoreticalDistribution,
} from "@/services/types/distributions";
import { getAllTheoreticalDistributions } from "@/services/types/distributions";

export type KSTestResult = {
  ksStatistic: number;
  pValue: number;
};

export function KolmogorovSmirnovCharacteristic<
  T extends DistributionCharacteristics,
>(series: AbstractSeries, theory: TheoreticalDistribution<T>): KSTestResult {
  const characteristics = theory.getCharacteristicsFromEmpiricalData(series);
  const data = [...series.initial_data].sort((a, b) => a - b);
  const n = data.length;

  // Handle empty dataset
  if (n === 0) {
    return { ksStatistic: NaN, pValue: NaN };
  }

  let D_plus = 0;
  let D_minus = 0;

  for (let i = 0; i < n; i++) {
    const x = data[i];
    const theoreticalCDF = theory.cdf(x, characteristics);

    const empiricalCDFBefore = i / n;
    const empiricalCDFAfter = (i + 1) / n;

    D_plus = Math.max(D_plus, empiricalCDFAfter - theoreticalCDF);
    D_minus = Math.max(D_minus, theoreticalCDF - empiricalCDFBefore);
  }

  const D = Math.max(D_plus, D_minus);
  const lambda = D * Math.sqrt(n);
  const pValue = approximateKSPValue(lambda);

  return { ksStatistic: D, pValue };
}

export function getKSTestForEveryDistributionType(
  series: AbstractSeries,
): Array<{ type: DistributionType; result: KSTestResult }> {
  const results: Array<{ type: DistributionType; result: KSTestResult }> = [];

  getAllTheoreticalDistributions().forEach(({ type, theory }) => {
    results.push({
      type,
      result: KolmogorovSmirnovCharacteristic(series, theory),
    });
  });

  return results;
}

export function getBestDistributionByKS(
  series: AbstractSeries,
): { type: DistributionType; result: KSTestResult } | null {
  const results = getKSTestForEveryDistributionType(series);

  // Filter out invalid results (NaN pValues)
  const validResults = results
    .filter(
      (item) => !isNaN(item.result.ksStatistic) && !isNaN(item.result.pValue),
    )
    .filter((result) => result.result.pValue >= 0.05);

  if (validResults.length === 0) {
    console.warn("No valid distributions available for K-S test.");
    return null;
  }

  validResults.sort((a, b) => b.result.ksStatistic - a.result.ksStatistic);
  return validResults[0];
}
