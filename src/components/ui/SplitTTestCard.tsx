// src/components/ui/SplitTTestCard.tsx
import React from "react";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
import type { VariationSeries } from "@/services/variationSeries";
import { Card, CardContent } from "@/components/ui/card";
import { splitSeries } from "@/services/theoretical/ttest/splitSeries";
import { twoSampleTTest } from "@/services/theoretical/ttest/twoSampleTTest";

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
        <h3 className='text-lg font-semibold text-center'>{title}</h3>

        <div className='text-sm font-mono'>
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

        <p className='text-center font-medium'>{verdict}</p>
      </CardContent>
    </Card>
  );
};

export default SplitTTestCard;
