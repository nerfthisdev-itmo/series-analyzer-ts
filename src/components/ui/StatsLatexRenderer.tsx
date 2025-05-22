import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import type { DistributionType } from "@/services/seriesMath";
import { useVariationSeries } from "@/context/VariationSeriesContext";

type Props = {
  type: "interval" | "simple";
  distribution?: DistributionType;
};

const StatsLatexRenderer: React.FC<Props> = ({ type, distribution }) => {
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

      // Сравнение с теоретическими моментами для нормального распределения
      if (distribution === "normal") {
        const normalCI = series.getNormalConfidenceIntervals(0.95);

        lines.push(
          "\\text{\\textbf{Доверительные интервалы (доверие 95\\%):}}",
        );
        lines.push(
          `\\text{Математическое ожидание (норм.): } [${normalCI.mean[0].toFixed(4)}, ${normalCI.mean[1].toFixed(4)}]`,
        );
        lines.push(
          `\\text{Дисперсия (норм.): } [${normalCI.variance[0].toFixed(4)}, ${normalCI.variance[1].toFixed(4)}]`,
        );
        const mu = series.expectedValue;
        const sigma = series.sampleStandardDeviation;
        const skew = series.getTheoreticalSkewness("normal", { mu, sigma });
        const kurt = series.getTheoreticalKurtosis("normal", { mu, sigma });

        lines.push(
          "\\text{\\textbf{Сравнение с теоретическими моментами (нормальное распределение):}}",
        );
        lines.push(
          `\\text{Математическое ожидание: эмп. } \\hat{M} = ${mu.toFixed(4)}, \\text{ теор. } M = ${mu.toFixed(4)}`,
        );
        lines.push(
          `\\text{Дисперсия: эмп. } D = ${(sigma ** 2).toFixed(4)}, \\text{ теор. } D = ${(sigma ** 2).toFixed(4)}`,
        );
        lines.push(
          `\\text{Мода: эмп. } Mo = ${series.mode.toFixed(4)} \\text{ (для нормального } Mo = \\mu)`,
        );
        lines.push(
          `\\text{Медиана: эмп. } Me = ${series.median.toFixed(4)} \\text{ (для нормального } Me = \\mu)`,
        );
        lines.push(
          `\\text{Ассиметрия: эмп. } A = ${series.getNthMoment(3).toFixed(4)}, \\text{ теор. } A = ${skew.toFixed(4)}`,
        );
        lines.push(
          `\\text{Эксцесс: эмп. } E = ${series.getNthMoment(4).toFixed(4)}, \\text{ теор. } E = ${kurt.toFixed(4)}`,
        );
      }

      // Сравнение частот
      if (distribution === "normal") {
        lines.push("\\text{\\textbf{Сравнение частот по интервалам:}}");
        const empiricalFrequencies = Object.values(series.statisticalSeries);
        const theoreticalFrequencies = series.getTheoreticalFrequencies();
        const borders = series.intervalBorders;

        empiricalFrequencies.forEach((empFreq, i) => {
          lines.push(
            `\\text{Интервал } [${borders[i].toFixed(3)}, ${borders[i + 1].toFixed(3)}): \\text{Эмп. } f_э = ${empFreq}, \\text{Теор. } f_т \\approx ${theoreticalFrequencies[i].toFixed(4)}`,
          );
        });
      }
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

      // Сравнение с биномиальным теоретическим распределением
      if (distribution === "binomial") {
        const ci = series.getNormalConfidenceIntervals(0.95);
        const binomialCI = series.getBinomialConfidenceIntervals(0.95);

        const { n, p } = series.getBinomialParams(series.n)

        lines.push(
          "\\text{\\textbf{Доверительные интервалы (доверие 95\\%):}}",
        );
        lines.push(
          `\\text{Математическое ожидание: } [${ci.mean[0].toFixed(4)}, ${ci.mean[1].toFixed(4)}]`,
        );
        lines.push(
          `\\text{Дисперсия: } [${ci.variance[0].toFixed(4)}, ${ci.variance[1].toFixed(4)}]`,
        );
        // lines.push(
        //   `\\text{Вероятность успеха (бином.): } [${binomialCI.p[0].toFixed(4)}, ${binomialCI.p[1].toFixed(4)}]`,
        // );
        lines.push(
          `\\text{Вероятность успеха (бином.): } ${p.toFixed(4)} \\in [${binomialCI.p[0].toFixed(4)}, ${binomialCI.p[1].toFixed(4)}]`,
        );

        const theoretical = series.getTheoreticalCharacteristics("binomial");

        lines.push(
          "\\text{\\textbf{Сравнение с теоретическими моментами (биномиальное распределение):}}",
        );
        lines.push(
          `\\text{Математическое ожидание: эмп. } \\hat{M} = ${series.expectedValueEstimate.toFixed(4)}, \\text{ теор. } M = ${theoretical.mean.toFixed(4)}`,
        );
        lines.push(
          `\\text{Дисперсия: эмп. } D = ${series.sampleVariance.toFixed(4)}, \\text{ теор. } D = ${theoretical.variance.toFixed(4)}`,
        );
        lines.push(
          `\\text{Мода: эмп. } Mo = ${series.mode.toFixed(4)}, \\text{ теор. } Mo = ${theoretical.mode.toFixed(4)}`,
        );
        lines.push(
          `\\text{Ассиметрия: эмп. } A = ${series.getNthMoment(3).toFixed(4)}, \\text{ теор. } A = ${theoretical.skewness.toFixed(4)}`,
        );
        lines.push(
          `\\text{Эксцесс: эмп. } E = ${series.getNthMoment(4).toFixed(4)}, \\text{ теор. } E = ${theoretical.kurtosis.toFixed(4)}`,
        );

        const empiricalFrequencies = series.statisticalSeries;
        const theoreticalFrequencies =
          series.getTheoreticalFrequencies("binomial");

        lines.push("\\text{\\textbf{Сравнение частот:}}");
        for (const key in empiricalFrequencies) {
          const x = parseFloat(key);
          const f_emp = empiricalFrequencies[key];
          const f_theo = theoreticalFrequencies[x] ?? 0;
          lines.push(
            `\\text{Значение } ${x}: \\text{Эмп. } f_э = ${f_emp}, \\text{Теор. } f_т \\approx ${f_theo.toFixed(4)}`,
          );
        }
      }
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
