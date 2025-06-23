// src/components/ui/MeanVarTestCard.tsx
import React from "react";
import type { VariationSeries } from "@/services/series/variationSeries";
import type { IntervalVariationSeries } from "@/services/series/intervalSeries";
import type { DistributionType } from "@/services/types/distributions";
import { getTheoreticalDistribution } from "@/services/types/distributions";
import { Card, CardContent } from "@/components/ui/card";
import {
  testMean,
  testVariance,
} from "@/services/distributions/confidenceIntervals";

type Props = {
  title: string;
  series: VariationSeries | IntervalVariationSeries;
  distType: DistributionType; // какую теорию брать для характеристик
  /** Нулевая гипотеза для μ (если не передать → возьмём теоретический μ) */
  H0mean?: number;
  /** Нулевая гипотеза для σ² (если не передать → возьмём теоретическую σ²) */
  H0var?: number;
  alpha?: number; // уровень значимости (используется для текста)
};

const MeanVarTestCard: React.FC<Props> = ({
  title,
  series,
  distType,
  H0mean,
  H0var,
  alpha = 0.05,
}) => {
  const theory = getTheoreticalDistribution(distType);
  const chars = theory.getCharacteristicsFromEmpiricalData(series);
  const { mean, sigma } = theory.getStandardMetrics(chars);

  const a0 = H0mean ?? mean;
  const sigma0 = H0var ?? sigma ** 2;

  const meanRes = testMean(a0, chars, theory);
  const varRes = testVariance(Math.sqrt(sigma0), chars, theory);

  return (
    <Card>
      <CardContent className='space-y-3 p-4 text-sm'>
        <h4 className='font-semibold text-center'>{title}</h4>

        {/* ------------- тест среднего ------------- */}
        <div>
          <div className='font-medium'>Тест для μ:</div>

          <div>
            CI&nbsp;=&nbsp;[{meanRes.confidenceInterval[0].toFixed(4)},&nbsp;
            {meanRes.confidenceInterval[1].toFixed(4)}]
          </div>
          <div className='font-medium'>
            {meanRes.reject
              ? `Отвергаем H₀ при α=${alpha}`
              : `H₀ не отвергается при α=${alpha}`}
          </div>
        </div>

        <hr className='my-1 border-dashed' />

        {/* ------------- тест дисперсии ------------- */}
        <div>
          <div className='font-medium'>Тест для σ²:</div>

          <div>
            CI&nbsp;=&nbsp;[{varRes.confidenceInterval[0].toFixed(4)},&nbsp;
            {varRes.confidenceInterval[1].toFixed(4)}]
          </div>
          <div className='font-medium'>
            {varRes.reject
              ? `Отвергаем H₀ при α=${alpha}`
              : `H₀ не отвергается при α=${alpha}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeanVarTestCard;
