import { jStat } from "jstat";

import type { AbstractSeries } from "@/services/series/AbstractSeries";

export type CorrelationTestResult = {
  tStat: number;
  pValue: number;
  alpha: number;
};

export function testPearsonCorrelation(
  X: AbstractSeries,
  Y: AbstractSeries,
  correlation: number,
): CorrelationTestResult {
  const n = X.n;
  const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation ** 2));
  const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), n - 2));

  return {
    tStat,
    pValue,
    alpha: 0.05,
  };
}
