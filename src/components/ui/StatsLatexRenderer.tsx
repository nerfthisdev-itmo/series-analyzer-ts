import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
import type { VariationSeries } from "@/services/variationSeries";
import { useVariationSeries } from "@/context/VariationSeriesContext";

type Props = {
  type: "interval" | "simple";
};

const StatsLatexRenderer: React.FC<Props> = ({ type }) => {
  const lines: Array<string> = [];
  const { seriesA, seriesB } = useVariationSeries();

  if (type === "interval") {
    const series = seriesB;
    if (series !== null && series.initial_data.length !== 0) {
      lines.push(`\\text{Минимум: } \\min = ${series.min}`);
      lines.push(`\\text{Максимум: } \\max = ${series.max}`);
      lines.push(`\\text{Размах: } R = ${series.range}`);
      lines.push(
        `\\text{Интервалов (Стерджесс): } k = ${series.intervalCount}`,
      );
      lines.push(
        `\\text{Длина интервала: } h = ${series.intervalLength.toFixed(3)}`,
      );
      lines.push(
        `\\text{Математическое ожидание: } \\hat{M} = ${series.expectedValue.toFixed(4)}`,
      );
      lines.push(`\\text{Дисперсия: } D = ${series.sampleVariance.toFixed(4)}`);
      lines.push(
        `\\text{Стандартное отклонение: } \\sigma = ${series.sampleStandardDeviation.toFixed(4)}`,
      );
      lines.push(`\\text{Мода: } Mo = ${series.mode.toFixed(4)}`);
      lines.push(`\\text{Медиана: } Me = ${series.median.toFixed(4)}`);
      lines.push(
        `\\text{Ассиметрия: } A = ${series.getNthMoment(3).toFixed(4)}`,
      );
      lines.push(`\\text{Эксцесс: } E = ${series.getNthMoment(4).toFixed(4)}`);
    } else {
      lines.push(`\\text{Данные выборки B не найдены}`);
    }
  } else {
    const series = seriesA;
    if (series !== null && series.initial_data.length !== 0) {
      lines.push(`\\text{Минимум: } \\min = ${series.min}`);
      lines.push(`\\text{Максимум: } \\max = ${series.max}`);
      lines.push(`\\text{Размах: } R = ${series.range}`);
      lines.push(`\\text{Дисперсия: } D = ${series.sampleVariance.toFixed(4)}`);
      lines.push(
        `\\text{Стандартное отклонение: } \\sigma = ${series.sampleStandardDeviation.toFixed(4)}`,
      );
      lines.push(
        `\\text{Исправленное СКО: } \\sigma^* = ${series.sampleStandardDeviationCorrected.toFixed(4)}`,
      );
      lines.push(`\\text{Мода: } Mo = ${series.mode.toFixed(4)}`);
      lines.push(`\\text{Медиана: } Me = ${series.median.toFixed(4)}`);
      lines.push(
        `\\text{Ассиметрия: } A = ${series.getNthMoment(3).toFixed(4)}`,
      );
      lines.push(`\\text{Эксцесс: } E = ${series.getNthMoment(4).toFixed(4)}`);
    } else {
      lines.push(`\\text{Данные выборки A не найдены}`);
    }
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
