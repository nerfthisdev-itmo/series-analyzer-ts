import React from "react";
import type { DistributionType } from "@/services/seriesMath";
import { useVariationSeries } from "@/context/VariationSeriesContext";

type Props = {
  type: "interval" | "simple";
  distribution?: DistributionType;
};

const StatsTextRenderer: React.FC<Props> = ({ type, distribution }) => {
  const { seriesA, seriesB } = useVariationSeries();
  const lines: Array<string> = [];

  const format = (label: string, value: number | string) =>
    `${label.padEnd(30, " ")}: ${value}`;

  const renderInterval = () => {
    const s = seriesB;
    if (!s || s.initial_data.length === 0) {
      lines.push("Данные выборки B не найдены");
      return;
    }

    lines.push(format("Минимум", s.min));
    lines.push(format("Максимум", s.max));
    lines.push(format("Размах", s.range));
    lines.push(format("Интервалов (Стерджесс)", s.intervalCount));
    lines.push(format("Длина интервала", s.intervalLength.toFixed(3)));
    lines.push(format("Мат. ожидание (μ)", s.expectedValue.toFixed(4)));
    lines.push(format("Дисперсия (D)", s.sampleVariance.toFixed(4)));
    lines.push(format("СКО (σ)", s.sampleStandardDeviation.toFixed(4)));
    lines.push(format("Мода", s.mode.toFixed(4)));
    lines.push(format("Медиана", s.median.toFixed(4)));
    lines.push(format("Асимметрия (A)", s.getNthMoment(3).toFixed(4)));
    lines.push(format("Эксцесс (E)", s.getNthMoment(4).toFixed(4)));

    if (distribution === "normal") {
      const mu = s.expectedValue;
      const sigma = s.sampleStandardDeviation;
      const normalCI = s.getNormalConfidenceIntervals(0.95);

      lines.push("");
      lines.push("Доверительные интервалы (95%):");
      lines.push(
        format(
          "Мат. ожидание (μ)",
          `[${normalCI.mean[0].toFixed(4)}, ${normalCI.mean[1].toFixed(4)}]`,
        ),
      );
      lines.push(
        format(
          "Дисперсия (σ²)",
          `[${normalCI.variance[0].toFixed(4)}, ${normalCI.variance[1].toFixed(4)}]`,
        ),
      );

      lines.push("");
      lines.push("Теоретические моменты (норм. распр.):");
      lines.push(
        format(
          "Асимметрия (A)",
          `эмп. ${s.getNthMoment(3).toFixed(4)}, теор. ${s.getTheoreticalSkewness("normal", { mu, sigma }).toFixed(4)}`,
        ),
      );
      lines.push(
        format(
          "Эксцесс (E)",
          `эмп. ${s.getNthMoment(4).toFixed(4)}, теор. ${s.getTheoreticalKurtosis("normal", { mu, sigma }).toFixed(4)}`,
        ),
      );
    }
  };

  const renderSimple = () => {
    const s = seriesA;
    if (!s || s.initial_data.length === 0) {
      lines.push("Данные выборки A не найдены");
      return;
    }

    lines.push(format("Минимум", s.min));
    lines.push(format("Максимум", s.max));
    lines.push(format("Размах", s.range));
    lines.push(format("Дисперсия", s.sampleVariance.toFixed(4)));
    lines.push(format("СКО (σ)", s.sampleStandardDeviation.toFixed(4)));
    lines.push(
      format(
        "Исправленное СКО (σ*)",
        s.sampleStandardDeviationCorrected.toFixed(4),
      ),
    );
    lines.push(format("Мода", s.mode.toFixed(4)));
    lines.push(format("Медиана", s.median.toFixed(4)));
    lines.push(format("Асимметрия", s.getNthMoment(3).toFixed(4)));
    lines.push(format("Эксцесс", s.getNthMoment(4).toFixed(4)));

    if (distribution === "binomial") {
      const ci = s.getNormalConfidenceIntervals(0.95);
      const binomialCI = s.getBinomialConfidenceIntervals(0.95);
      const { p } = s.getBinomialParams(s.n);
      const theoretical = s.getTheoreticalCharacteristics("binomial");

      lines.push("");
      lines.push("Доверительные интервалы (95%):");
      lines.push(
        format(
          "Мат. ожидание",
          `[${ci.mean[0].toFixed(4)}, ${ci.mean[1].toFixed(4)}]`,
        ),
      );
      lines.push(
        format(
          "Дисперсия",
          `[${ci.variance[0].toFixed(4)}, ${ci.variance[1].toFixed(4)}]`,
        ),
      );
      lines.push(
        format(
          "Вероятность успеха (p)",
          `${p.toFixed(4)} ∈ [${binomialCI.p[0].toFixed(4)}, ${binomialCI.p[1].toFixed(4)}]`,
        ),
      );

      lines.push("");
      lines.push("Теоретические моменты (бином.):");
      lines.push(
        format(
          "Мат. ожидание",
          `эмп. ${s.expectedValueEstimate.toFixed(4)}, теор. ${theoretical.mean.toFixed(4)}`,
        ),
      );
      lines.push(
        format(
          "Дисперсия",
          `эмп. ${s.sampleVariance.toFixed(4)}, теор. ${theoretical.variance.toFixed(4)}`,
        ),
      );
      lines.push(
        format(
          "Мода",
          `эмп. ${s.mode.toFixed(4)}, теор. ${theoretical.mode.toFixed(4)}`,
        ),
      );
      lines.push(
        format(
          "Асимметрия",
          `эмп. ${s.getNthMoment(3).toFixed(4)}, теор. ${theoretical.skewness.toFixed(4)}`,
        ),
      );
      lines.push(
        format(
          "Эксцесс",
          `эмп. ${s.getNthMoment(4).toFixed(4)}, теор. ${theoretical.kurtosis.toFixed(4)}`,
        ),
      );
    }
  };

  type === "interval" ? renderInterval() : renderSimple();

  return (
    <pre
      className='whitespace-pre-wrap text-sm p-3 rounded-lg bg-gray-50 text-gray-800 dark:bg-neutral-900 dark:text-gray-100'
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {lines.join("\n")}
    </pre>
  );
};
export default StatsTextRenderer;
