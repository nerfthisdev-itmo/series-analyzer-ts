/* ──────────────────────────────────────────────────────────────
 * StatsTextRenderer.tsx
 * Таблица сравнения эмпирических и теоретических характеристик.
 * Всегда берёт выбор распределений (distsA / distsB) из VariationSeriesContext.
 * ────────────────────────────────────────────────────────────── */

import React from "react";

import type { DistributionType } from "@/services/theoretical/theoreticalTypes";
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

  /** css-класс для ячейки «|Δ|» */
  const diffClass = (d: number) =>
    d > diffThreshold ? "text-red-600 dark:text-red-400" : "";

  /* ───────── готовим теорию для выбранной пары ───────── */

  const theories = pair.map((d) => {
    const dist = getTheoreticalDistribution(d);
    const chars = dist.getCharacteristicsFromEmpiricalData(series);
    const base = dist.getStandardMetrics(chars)
    return {
      type: d,
      mean: base.mean,
      variance: base.variance,
      sd: base.sigma,
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
              className='dark:even:bg-neutral-900 even:bg-gray-50'
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
