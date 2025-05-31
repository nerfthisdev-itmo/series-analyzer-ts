/* ──────────────────────────────────────────────────────────────
 * StatsTextRenderer.tsx
 * Таблица сравнения эмпирических и теоретических характеристик.
 * Всегда берёт выбор распределений (distsA / distsB) из VariationSeriesContext.
 * ────────────────────────────────────────────────────────────── */

import React from "react";

import type { DistributionType } from "@/services/theoretical/theoreticalTypes";
import type { BinomialDistributionCharacteristics } from "@/services/theoretical/distributions/binomialDistribution";
import type { GeometricDistributionCharacteristics } from "@/services/theoretical/distributions/geometricDistribution";
import type { LaplaceDistributionCharacteristics } from "@/services/theoretical/distributions/laplaceDistribution";
import type { NormalDistributionCharacteristics } from "@/services/theoretical/distributions/normalDistribution";
import type { UniformDistributionCharacteristics } from "@/services/theoretical/distributions/uniformDistribution";
import type { ExponentialDistributionCharacteristics } from "@/services/theoretical/distributions/exponentialDistribution";
import type { PoissonDistributionCharacteristics } from "@/services/theoretical/distributions/poissonDistribution";
import { getTheoreticalDistribution } from "@/services/theoretical/getTheoreticalDistribution";
import { useVariationSeries } from "@/context/VariationSeriesContext";

type Props = {
  /** какой ряд рендерим: A или B (по-умолчанию A) */
  useSeries?: "A" | "B";
  /** порог для подсветки абсолютного расхождения |emp-theo| */
  diffThreshold?: number;
};

/* ────────────────────────────────────────────────────────────── */

const StatsTextRenderer: React.FC<Props> = ({
  useSeries = "A",
  diffThreshold = 0.1,
}) => {
  /* --- достаём всё необходимое из контекста --- */
  const { seriesA, seriesB, distsA, distsB } = useVariationSeries();

  const series = useSeries === "A" ? seriesA : seriesB;
  const pair: [DistributionType, DistributionType] =
    useSeries === "A" ? distsA : distsB;

  if (!series || series.initial_data.length === 0) {
    return <p>Данные выборки не найдены</p>;
  }

  /* ───────── helpers ───────── */

  /** вычисляем mean / variance / sd для каждого распределения */
  const buildMetrics = (
    type: DistributionType,
    chars: any,
  ): { mean: number; variance: number; sd: number } => {
    switch (type) {
      case "normal": {
        const c = chars as NormalDistributionCharacteristics;
        return { mean: c.mu, variance: c.sigma ** 2, sd: c.sigma };
      }
      case "binomial": {
        const c = chars as BinomialDistributionCharacteristics;
        const v = c.n * c.p * (1 - c.p);
        return { mean: c.n * c.p, variance: v, sd: Math.sqrt(v) };
      }
      case "geometric": {
        const c = chars as GeometricDistributionCharacteristics;
        const mean = 1 / c.p;
        const variance = (1 - c.p) / c.p ** 2;
        return { mean, variance, sd: Math.sqrt(variance) };
      }
      case "laplace": {
        const c = chars as LaplaceDistributionCharacteristics; // { mu, b }
        return { mean: c.mu, variance: 2 * c.b ** 2, sd: Math.SQRT2 * c.b };
      }
      case "uniform": {
        const c = chars as UniformDistributionCharacteristics; // { a, b }
        const mean = (c.a + c.b) / 2;
        const variance = (c.b - c.a) ** 2 / 12;
        return { mean, variance, sd: Math.sqrt(variance) };
      }
      case "exponential": {
        const c = chars as ExponentialDistributionCharacteristics; // { lambda }
        const mean = 1 / c.lambda;
        const variance = 1 / c.lambda ** 2;
        return { mean, variance, sd: Math.sqrt(variance) };
      }
      case "poisson": {
        const c = chars as PoissonDistributionCharacteristics; // { lambda }
        return { mean: c.lambda, variance: c.lambda, sd: Math.sqrt(c.lambda) };
      }
      default:
        throw new Error("Unsupported distribution");
    }
  };

  /** css-класс для ячейки «|Δ|» */
  const diffClass = (d: number) =>
    d > diffThreshold ? "text-red-600 dark:text-red-400" : "";

  /* ───────── готовим теорию для выбранной пары ───────── */

  const theories = pair.map((d) => {
    const dist = getTheoreticalDistribution(d);
    const chars = dist.getCharacteristicsFromEmpiricalData(series);
    const base = buildMetrics(d, chars);
    return {
      type: d,
      mean: base.mean,
      variance: base.variance,
      sd: base.sd,
      skewness: dist.getTheoreticalSkewness(chars),
      kurtosis: dist.getTheoreticalKurtosis(chars),
    };
  });

  /* ───────── строки таблицы ───────── */

  const rows = [
    { label: "Мат. ожидание (μ)", emp: series.mean, key: "mean" as const },
    { label: "Дисперсия (D)", emp: series.variance, key: "variance" as const },
    {
      label: "СКО (σ)",
      emp: series.sampleStandardDeviation,
      key: "sd" as const,
    },
    {
      label: "Асимметрия (A)",
      emp: series.getNthMoment(3),
      key: "skewness" as const,
    },
    {
      label: "Эксцесс (E)",
      emp: series.getNthMoment(4),
      key: "kurtosis" as const,
    },
  ];

  /* ───────── рендер ───────── */

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full text-sm border-collapse'>
        <thead className='bg-zinc-200 dark:bg-zinc-800'>
          <tr>
            <th className='px-3 py-1 text-left'>Показатель</th>
            <th className='px-3 py-1 text-right'>Эмпир.</th>
            {theories.map((t) => (
              <th key={t.type} colSpan={2} className='px-3 py-1 text-center'>
                {t.type.toUpperCase()}
              </th>
            ))}
          </tr>
          <tr className='bg-zinc-100 dark:bg-zinc-700 text-xs'>
            <th />
            <th />
            {theories.map((t) => (
              <React.Fragment key={t.type}>
                <th className='px-2 py-0.5'>Теор.</th>
                <th className='px-2 py-0.5'>|Δ|</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.label}
              className='even:bg-gray-50 dark:even:bg-neutral-900'
            >
              <td className='px-3 py-1'>{r.label}</td>
              <td className='px-3 py-1 text-right'>{r.emp.toFixed(4)}</td>

              {theories.map((t) => {
                const theo = t[r.key];
                const diff = Math.abs(r.emp - theo);
                return (
                  <React.Fragment key={t.type + r.key}>
                    <td className='px-3 py-1 text-right'>{theo.toFixed(4)}</td>
                    <td
                      className={
                        "px-3 py-1 text-right font-medium " + diffClass(diff)
                      }
                    >
                      {diff.toFixed(4)}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTextRenderer;
