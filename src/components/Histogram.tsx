"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  XAxis,
} from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
import type { DistributionType, TheoreticalDistribution } from "@/services/theoretical/theoreticalTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTheoreticalDistribution } from "@/services/theoretical/getTheoreticalDistribution";
import { calculateContinuousTheoreticalFrequencies } from "@/services/theoretical/theoreticalFrequencies";
import { getBestDistributionTypeByPearson } from "@/services/theoretical/pearsonsCriteria";

const chartConfig = {
  number_of_occurrences: {
    label: "Number of occurrences",
    color: "hsl(var(--chart-1))",
  },
  theoretical_frequency: {
    label: "Theoretical Frequency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type HistogramEntry = {
  bin_center: number;
  number_of_occurrences: number;
};

type HistogramWithTheoreticalValuesEntry = HistogramEntry & {
  theoretical_frequency: number;
};

export function Histogram({
  intervalVariationSeries,
  distributionType
}: {
  intervalVariationSeries: IntervalVariationSeries;
  distributionType?: "auto" | DistributionType
}) {
  const chartData = new Array<HistogramWithTheoreticalValuesEntry | HistogramEntry>();

  if (distributionType == "auto") {
    distributionType = getBestDistributionTypeByPearson(intervalVariationSeries)
  }

  if (distributionType != undefined) {
    const theory = getTheoreticalDistribution(distributionType)

    const characteristics = theory.getCharacteristicsFromEmpiricalData(intervalVariationSeries);

    const theoretical_frequencies = Object.values(
      calculateContinuousTheoreticalFrequencies(
        characteristics,
        theory,
        intervalVariationSeries.intervalBorders
      )
    );

    Object.entries(intervalVariationSeries.getStatisticalSeries()).forEach(
      ([bin_center_str, number_of_occurrences]: [string, number], index) => {
        const bin_center = parseFloat(bin_center_str);

        chartData.push({
          bin_center,
          number_of_occurrences,
          theoretical_frequency: theoretical_frequencies[index],
        } satisfies HistogramWithTheoreticalValuesEntry);
      },
    );
  } else {
    Object.entries(intervalVariationSeries.getStatisticalSeries()).forEach(
      ([bin_center_str, number_of_occurrences]: [string, number]) => {
        const bin_center = parseFloat(bin_center_str);

        chartData.push({
          bin_center,
          number_of_occurrences,
        } satisfies HistogramEntry);
      },
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Histogram</CardTitle>
        <CardDescription>
          Constructed by counting number of elements inside each interval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='bin_center'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey='number_of_occurrences'
              fill='var(--color-number_of_occurrences)'
              radius={8}
            >
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>

            {distributionType != undefined ? <Line
              dataKey='theoretical_frequency'
              stroke='var(--color-theoretical_frequency)'
              type='natural'
              strokeWidth={2}
              dot={false}
            /> : <></>}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
