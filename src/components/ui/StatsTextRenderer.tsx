import React from "react";
import type { BinomialDistributionCharacteristics } from "@/services/theoretical/binomialDistribution";
import type { GeometricDistributionCharacteristics } from "@/services/theoretical/geometricDistribution";
import type { LaplaceDistributionCharacteristics } from "@/services/theoretical/laplaceDistribution";
import type { NormalDistributionCharacteristics } from "@/services/theoretical/normalDistribution";
import type { DistributionType } from "@/services/theoretical/theoreticalTypes";
import { getTheoreticalDistribution } from "@/services/theoretical/getTheoreticalDistribution";
import { useVariationSeries } from "@/context/VariationSeriesContext";

type Props = {
  distributions: [DistributionType, DistributionType];
  useSeries?: "A" | "B";
  diffThreshold?: number;
};

const StatsTextRenderer: React.FC<Props> = ({
  distributions,
  useSeries = "A",
  diffThreshold = 0.1,
}) => {
  const { seriesA, seriesB } = useVariationSeries();
  const s = useSeries === "A" ? seriesA : seriesB;

  if (!s || s.initial_data.length === 0) {
    return <p>Данные выборки не найдены</p>;
  }

  /* ------ helpers (buildMetrics / getDiffClass) ------ */
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
        const c = chars as LaplaceDistributionCharacteristics; // {mu,b}
        return { mean: c.mu, variance: 2 * c.b ** 2, sd: Math.SQRT2 * c.b };
      }
      default:
        throw new Error("unsupported distribution");
    }
  };

  const getDiffClass = (d: number) =>
    d > diffThreshold ? "text-red-600 dark:text-red-400" : "";

  const theories = distributions.map((d) => {
    const dist = getTheoreticalDistribution(d);
    const chars = dist.getCharacteristicsFromEmpiricalData(s);
    const base = buildMetrics(d, chars);
    return {
      type: d,
      dist,
      chars,
      mean: base.mean,
      variance: base.variance,
      sd: base.sd,
      skewness: dist.getTheoreticalSkewness(chars),
      kurtosis: dist.getTheoreticalKurtosis(chars),
    };
  });

  const rows = [
    { label: "Мат. ожидание (μ)", emp: s.mean, key: "mean" as const },
    { label: "Дисперсия (D)", emp: s.variance, key: "variance" as const },
    {
      label: "СКО (σ)",
      emp: s.sampleStandardDeviation,
      key: "sd" as const,
    },
    {
      label: "Асимметрия (A)",
      emp: s.getNthMoment(3),
      key: "skewness" as const,
    },
    {
      label: "Эксцесс (E)",
      emp: s.getNthMoment(4),
      key: "kurtosis" as const,
    },
  ];

  /* --------------- рендер ---------------- */
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full text-sm border-collapse'>
        <thead className='bg-gray-200 dark:bg-neutral-800'>
          <tr>
            <th className='px-3 py-1 text-left'>Показатель</th>
            <th className='px-3 py-1 text-right'>Эмпир.</th>
            {theories.map((t) => (
              <th key={t.type} colSpan={2} className='px-3 py-1 text-center'>
                {t.type.toUpperCase()}
              </th>
            ))}
          </tr>
          <tr className='bg-gray-100 dark:bg-neutral-700 text-xs'>
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
                        "px-3 py-1 text-right font-medium " + getDiffClass(diff)
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
