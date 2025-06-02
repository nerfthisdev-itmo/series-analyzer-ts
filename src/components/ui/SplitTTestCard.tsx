// src/components/ui/SplitTTestCard.tsx
import React from "react";
import type { IntervalVariationSeries } from "@/services/series/intervalSeries";
import type { VariationSeries } from "@/services/series/variationSeries";
import { Card, CardContent } from "@/components/ui/card";
import { splitSeries } from "@/services/statistical-tests/ttest/splitSeries";
import { twoSampleTTest } from "@/services/statistical-tests/ttest/twoSampleTTest";

type Props = {
  title: string; // «Ряд A» / «Ряд B»
  series: VariationSeries | IntervalVariationSeries;
  alpha?: number; // уровень значимости
};

const SplitTTestCard: React.FC<Props> = ({ title, series, alpha = 0.05 }) => {
  const [s1, s2] = splitSeries(series);
  const { t, df, p, mean1, mean2, sPooled } = twoSampleTTest(s1, s2);

  const verdict =
    p < alpha
      ? `Отвергаем H₀ при α=${alpha}`
      : `Нет оснований отвергнуть H₀ при α=${alpha}`;

  return (
    <Card>
      <CardContent className='space-y-3 p-4'>
        <h3 className='font-semibold text-lg text-center'>{title}</h3>

        <div className='font-mono text-sm'>
          <div>
            n₁ = {s1.n}, n₂ = {s2.n}
          </div>
          <div>
            μ₁ = {mean1.toFixed(4)}, μ₂ = {mean2.toFixed(4)}
          </div>
          <div>spooled = {sPooled.toFixed(4)}</div>
          <div>
            t = {t.toFixed(4)}, df = {df}
          </div>
          <div>p = {p.toFixed(4)}</div>
        </div>

        <p className='font-medium text-center'>{verdict}</p>
      </CardContent>
    </Card>
  );
};

export default SplitTTestCard;
