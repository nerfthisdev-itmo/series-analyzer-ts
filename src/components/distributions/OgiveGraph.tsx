"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import type { IntervalVariationSeries } from "@/services/series/intervalSeries";
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

const chartConfig = {
  cumulative_freq: {
    label: "Number of occurrences",
    color: "hsl(var(--chart-1))",
  },
  bin_center: {
    label: "Bin center",
    color: "hsl(var(--chart-1))",
  },
  median: {
    label: "Median",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type CumulativeGraphEntry = {
  bin_center: string;
  cumulative_freq: number;
};

export function OgiveGraph({
  intervalVariationSeries,
}: {
  intervalVariationSeries: IntervalVariationSeries;
}) {
  const data = new Array<CumulativeGraphEntry>();

  intervalVariationSeries.cumulativeValues.forEach((value, index) => {
    data.push({
      bin_center: intervalVariationSeries.binCenters[index].toString(),
      cumulative_freq: value,
    });
  });

  const n = intervalVariationSeries.n;
  const x_domain = [
    0,
    intervalVariationSeries.cumulativeValues[
      intervalVariationSeries.intervalCount - 1
    ],
  ];
  const y_domain = [
    intervalVariationSeries.binCenters[0],
    intervalVariationSeries.binCenters[n - 1],
  ];

  const medianValue = intervalVariationSeries.median;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ogive graph</CardTitle>
        <CardDescription>
          Constructed by flipping X and Y of cumulative graph
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='w-full min-h-[200px]'>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='cumulative_freq'
              type='number'
              domain={x_domain}
              tickLine={false}
              tickCount={data.length}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey='bin_center'
              type='number'
              domain={y_domain}
              tickLine={false}
              tickCount={data.length}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey='bin_center'
              type='linear'
              stroke='var(--color-cumulative_freq)'
              strokeWidth={2}
              dot={{
                fill: "var(--color-cumulative_freq)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <ReferenceLine
              y={medianValue}
              stroke='var(--color-median)'
              strokeWidth={2}
              strokeDasharray='5 5'
              label={{
                value: "Median",
                position: "insideTop",
                fill: "var(--color-median)",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
