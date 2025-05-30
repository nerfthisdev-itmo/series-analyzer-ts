import { getPearsonForEveryDistributionType } from "./pearsonsCriteria";
import { getKSTestForEveryDistributionType } from "./kolmogorovCriteria";
import type { PearsonResult } from "./pearsonsCriteria";
import type { KSTestResult } from "./kolmogorovCriteria";
import type { AbstractSeries } from "../AbstractSeries";
import type { DistributionType } from "./theoreticalTypes";

export function getBestDistributionType(
  series: AbstractSeries,
):
  | { type: DistributionType; result: PearsonResult }
  | { type: DistributionType; result: KSTestResult }
  | undefined {
  const pearson = getPearsonForEveryDistributionType(series);
  const kolmogorov = getKSTestForEveryDistributionType(series);

  const everything: Array<
    | { type: DistributionType; result: PearsonResult }
    | { type: DistributionType; result: KSTestResult }
  > = [...pearson, ...kolmogorov];

  everything.sort((a, b) => b.result.pValue - a.result.pValue);

  console.log(everything);

  return everything[0];
}
