import { getBestDistributionTypeByPearson } from "./pearsonsCriteria";
import { getBestDistributionByKS } from "./kolmogorovCriteria";
import type { KSTestResult } from "./kolmogorovCriteria";
import type { PearsonResult } from "./pearsonsCriteria";
import type { AbstractSeries } from "../AbstractSeries";
import type { DistributionType } from "./theoreticalTypes";

export function getBestDistributionType(
  series: AbstractSeries,
):
  | { type: DistributionType; result: PearsonResult }
  | { type: DistributionType; result: KSTestResult }
  | undefined {
  const pearson = getBestDistributionTypeByPearson(series);
  const kolmogorov = getBestDistributionByKS(series);

  console.log(pearson, kolmogorov);

  if (pearson == undefined && kolmogorov != undefined) {
    return kolmogorov;
  }
  if (pearson != undefined && kolmogorov == undefined) {
    return pearson;
  }
  if (pearson == undefined && kolmogorov == undefined) {
    return undefined;
  }
  if (pearson != undefined && kolmogorov != undefined) {
    return pearson.result.pValue > kolmogorov.result.pValue
      ? pearson
      : kolmogorov;
  }
}
