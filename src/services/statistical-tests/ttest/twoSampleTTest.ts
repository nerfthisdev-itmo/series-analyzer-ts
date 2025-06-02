// src/utils/twoSampleTTest.ts
import { jStat } from "jstat";
import type { VariationSeries } from "@/services/series/variationSeries";

export type TTestResult = {
  t: number;
  df: number;
  p: number; // двустороннее p-value
  mean1: number;
  mean2: number;
  sPooled: number; // общая дисперсия (sqrt)
};

export function twoSampleTTest(
  s1: VariationSeries,
  s2: VariationSeries,
): TTestResult {
  const n1 = s1.n;
  const n2 = s2.n;

  // исправленные дисперсии (σ*)
  const v1 = s1.sampleVariance;
  const v2 = s2.sampleVariance;

  // объединённая (pooled) дисперсия
  const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
  const sp = Math.sqrt(sp2);

  // t-статистика
  const t = (s1.mean - s2.mean) / (sp * Math.sqrt(1 / n1 + 1 / n2));

  const df = n1 + n2 - 2;

  // двусторонний p
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  return { t, df, p, mean1: s1.mean, mean2: s2.mean, sPooled: sp };
}
