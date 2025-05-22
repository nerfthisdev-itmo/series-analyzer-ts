import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
import type { VariationSeries } from "@/services/variationSeries";
import { useVariationSeries } from "@/context/VariationSeriesContext";
import { DistributionType } from "./seriesMath";

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
      lines.push(`\\text{ Минимум: } \\min = ${series.min} `);
      lines.push(`\\text{ Максимум: } \\max = ${series.max} `);
      lines.push(`\\text{ Размах: } R = ${series.range} `);
      lines.push(
        `\\text{ Интервалов(Стерджесс): } k = ${series.intervalCount} `,
      );
      lines.push(
        `\\text{Длина интервала: } h = ${series.intervalLength.toFixed(3)} `,
      );
      lines.push(
        `\\text{Математическое ожидание: } \\hat{ M } = ${series.expectedValue.toFixed(4)} `,
      );
      lines.push(
        `\\text{ Дисперсия: } D = ${series.sampleVariance.toFixed(4)} `,
      );
      lines.push(
        `\\text{Стандартное отклонение: } \\sigma = ${series.sampleStandardDeviation.toFixed(4)} `,
      );
      lines.push(`\\text{ Мода: } Mo = ${series.mode.toFixed(4)} `);
      lines.push(`\\text{ Медиана: } Me = ${series.median.toFixed(4)} `);
      lines.push(
        `\\text{ Ассиметрия: } A = ${series.getNthMoment(3).toFixed(4)} `,
      );
      lines.push(
        `\\text{ Эксцесс: } E = ${series.getNthMoment(4).toFixed(4)} `,
      );

      // Добавление сравнения теоретических и эмпирических частот для интервального ряда
      if (distribution === "normal") {
        lines.push(
          "\\text{Сравнение эмпирических и теоретических частот (Нормальное распределение):}",
        );
        lines.push(
          `\\text{Параметры нормального распределения(оценки): } \\mu \\approx ${series.expectedValue.toFixed(4)}, \\sigma \\approx ${series.sampleStandardDeviation.toFixed(4)} `,
        );
        lines.push(
          `\\text{Параметры нормального распределения(теоретические): } \\mu \\approx ${series.expectedValue.toFixed(4)}, \\sigma \\approx ${series.sampleStandardDeviation.toFixed(4)} `,
        );

        const empiricalFrequencies = Object.values(series.statisticalSeries);
        const theoreticalFrequencies: Array<number> =
          series.getTheoreticalFrequencies();
        const borders = series.intervalBorders;

        empiricalFrequencies.forEach((empFreq, index) => {
          lines.push(
            `\\text{ Интервал } [${borders[index].toFixed(3)}, ${borders[index + 1].toFixed(3)}): \\text{ Эмпирическая } f_{ э } = ${empFreq}, \\text{ Теоретическая } f_{ т } \\approx ${theoreticalFrequencies[index].toFixed(4)}`,
          );
        });
        //  TODO
        // } else if (distribution === "lognormal") {
        //     const { mu, sigma } = series.getLognormalParams();
        //     lines.push(
        //         "\\text{Сравнение эмпирических и теоретических частот (Логнормальное распределение):}",
        //     );
        //     lines.push(
        //         `\\text{ Параметры логнормального распределения(оценки): } \\mu_{ ln } \\approx ${mu.toFixed(4)}, \\sigma_{ ln } \\approx ${sigma.toFixed(4)}`,
        //     );

        //     const binCenters = series.binCenters;
        //     const empiricalFrequencies = Object.values(
        //         series.statisticalSeries,
        //     );
        //     const theoreticalFrequencies: number[] = [];
        //     const borders = series.intervalBorders;

        //     for (let i = 0; i < borders.length - 1; i++) {
        //         const lowerBound = borders[i];
        //         const upperBound = borders[i + 1];
        //         // Расчет теоретической частоты для интервала в логнормальном распределении
        //         const prob =
        //             series["lognormalCdf"](upperBound, mu, sigma) -
        //             series["lognormalCdf"](lowerBound, mu, sigma);
        //         theoreticalFrequencies.push(prob * series.n);
        //     }

        //     empiricalFrequencies.forEach((empFreq, index) => {
        //         lines.push(
        //             `\\text{ Интервал }[${borders[index].toFixed(3)}, ${borders[index + 1].toFixed(3)}): \\text{ Эмпирическая } f_{ э } = ${empFreq}, \\text{ Теоретическая } f_{ т } \\approx ${theoreticalFrequencies[index].toFixed(4)}`,
        //         );
        //     });
      }
    } else {
      lines.push(`\\text{ Данные выборки B не найдены }`);
    }
  } else {
    const series = seriesA;
    if (series !== null && series.initial_data.length !== 0) {
      lines.push(`\\text{ Минимум: } \\min = ${series.min}`);
      lines.push(`\\text{ Максимум: } \\max = ${series.max}`);
      lines.push(`\\text{ Размах: } R = ${series.range}`);
      lines.push(
        `\\text{ Дисперсия: } D = ${series.sampleVariance.toFixed(4)}`,
      );
      lines.push(
        `\\text{ Стандартное отклонение: } \\sigma = ${series.sampleStandardDeviation.toFixed(4)}`,
      );
      lines.push(
        `\\text{ Исправленное СКО: } \\sigma ^* = ${series.sampleStandardDeviationCorrected.toFixed(4)}`,
      );
      lines.push(`\\text{ Мода: } Mo = ${series.mode.toFixed(4)}`);
      lines.push(`\\text{ Медиана: } Me = ${series.median.toFixed(4)}`);
      lines.push(
        `\\text{ Ассиметрия: } A = ${series.getNthMoment(3).toFixed(4)}`,
      );
      lines.push(`\\text{ Эксцесс: } E = ${series.getNthMoment(4).toFixed(4)}`);

      // Добавление сравнения теоретических и эмпирических частот для дискретного ряда
      if (distribution === "binomial") {
        const theoreticalFrequencies =
          series.getTheoreticalFrequencies("binomial");
        const empiricalFrequencies = series.statisticalSeries;
        const theoreticalCharacteristics =
          series.getTheoreticalCharacteristics("binomial");

        lines.push(
          "\\text{Сравнение эмпирических и теоретических частот (Биномиальное распределение):}",
        );
        lines.push(
          `\\text{ Теоретические характеристики(Биномиальное): } M = ${theoreticalCharacteristics.mean.toFixed(4)}, D = ${theoreticalCharacteristics.variance.toFixed(4)}`,
        );

        for (const valueStr in empiricalFrequencies) {
          const value = parseFloat(valueStr);
          const empFreq = empiricalFrequencies[valueStr];
          const theoreticalFreq = theoreticalFrequencies[value] || 0;
          lines.push(
            `\\text{ Значение } ${value}: \\text{ Эмпирическая } f_{ э } = ${empFreq}, \\text{ Теоретическая } f_{ т } \\approx ${theoreticalFreq.toFixed(4)}`,
          );
        }
      }
    } else {
      lines.push(`\\text{ Данные выборки A не найдены }`);
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
