"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
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
} satisfies ChartConfig;

type CumulativeGraphEntry = {
  bin_center: string;
  cumulative_freq: number;
};

export function CumulativeGraph({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative chart</CardTitle>
        <CardDescription>
          Constructed by accumulating a number of occurrences for each bin
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
              dataKey='bin_center'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey='cumulative_freq'
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
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
