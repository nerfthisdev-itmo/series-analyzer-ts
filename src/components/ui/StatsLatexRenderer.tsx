import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
import type { VariationSeries } from "@/services/variationSeries";

type Props = {
  series: IntervalVariationSeries | VariationSeries;
  type: "interval" | "simple";
};

const StatsLatexRenderer: React.FC<Props> = ({ series, type }) => {
  const lines: Array<string> = [];

  lines.push(`\\text{Минимум: } \\min = ${series.min}`);
  lines.push(`\\text{Максимум: } \\max = ${series.max}`);
  lines.push(`\\text{Размах: } R = ${series.range}`);

  if (type === "interval") {
    const s = series as IntervalVariationSeries;
    lines.push(`\\text{Интервалов (Стерджесс): } k = ${s.intervalCount}`);
    lines.push(`\\text{Длина интервала: } h = ${s.intervalLength.toFixed(3)}`);
    lines.push(
      `\\text{Математическое ожидание: } \\hat{M} = ${s.expectedValue.toFixed(4)}`,
    );
    lines.push(`\\text{Дисперсия: } D = ${s.sampleVariance.toFixed(4)}`);
    lines.push(
      `\\text{Стандартное отклонение: } \\sigma = ${s.sampleStandardDeviation.toFixed(4)}`,
    );
    lines.push(`\\text{Мода: } Mo = ${s.mode.toFixed(4)}`);
    lines.push(`\\text{Медиана: } Me = ${s.median.toFixed(4)}`);
    lines.push(`\\text{Ассиметрия: } A = ${s.getNthMoment(3).toFixed(4)}`);
    lines.push(`\\text{Эксцесс: } E = ${s.getNthMoment(4).toFixed(4)}`);
  } else {
    const s = series as VariationSeries;
    lines.push(
      `\\text{Математическое ожидание: } \\hat{M} = ${s.expectedValueEstimate.toFixed(4)}`,
    );
    lines.push(`\\text{Дисперсия: } D = ${s.sampleVariance.toFixed(4)}`);
    lines.push(
      `\\text{Стандартное отклонение: } \\sigma = ${s.sampleStandardDeviation.toFixed(4)}`,
    );
    lines.push(
      `\\text{Исправленное СКО: } \\sigma^* = ${s.sampleStandardDeviationCorrected.toFixed(4)}`,
    );
    lines.push(`\\text{Мода: } Mo = ${s.mode.toFixed(4)}`);
    lines.push(`\\text{Медиана: } Me = ${s.median.toFixed(4)}`);
    lines.push(`\\text{Ассиметрия: } A = ${s.getNthMoment(3).toFixed(4)}`);
    lines.push(`\\text{Эксцесс: } E = ${s.getNthMoment(4).toFixed(4)}`);
  }

  return (
    <div className='space-y-2'>
      {lines.map((line, idx) => (
        <BlockMath key={idx}>{line}</BlockMath>
      ))}
    </div>
  );
};

export default StatsLatexRenderer;
