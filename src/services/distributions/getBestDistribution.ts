import { getBestDistributionTypeByPearson } from "../statistical-tests/pearson-test/pearsonTest";
import { getBestDistributionByKS } from "../statistical-tests/kolmogorov-smirnov-test/ksTest";
import type { KSTestResult } from "../statistical-tests/kolmogorov-smirnov-test/ksTest";
import type { PearsonResult } from "../statistical-tests/pearson-test/pearsonTest";
import type { AbstractSeries } from "../series/AbstractSeries";
import type { DistributionType } from "../types/distributions";

export function getBestDistributionType(
  series: AbstractSeries,
):
  | { type: DistributionType; result: PearsonResult }
  | { type: DistributionType; result: KSTestResult }
  | undefined {
  const pearson = getBestDistributionTypeByPearson(series);
  const kolmogorov = getBestDistributionByKS(series);

  const results = [pearson, kolmogorov]
    .filter((res) => res != undefined)
    .sort((a, b) => b.result.pValue - a.result.pValue);

  return results.length > 0 ? results[0] : undefined;
}
