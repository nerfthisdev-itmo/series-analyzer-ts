"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
  number_of_occurrences: {
    label: "Number of occurrences",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type HistogramEntry = {
  boarders_str: string;
  number_of_occurrences: number;
};

export function Histogram({
  intervalVariationSeries,
}: {
  intervalVariationSeries: IntervalVariationSeries;
}) {
  const chartData = new Array<HistogramEntry>();

  Object.entries(intervalVariationSeries.getStatisticalSeries()).forEach(
    ([boarders_str, number_of_occurrences]) => {
      chartData.push({ boarders_str, number_of_occurrences });
    },
  );

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
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='boarders_str'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => {
                const values = value.split(", ");
                values[0] = values[0].slice(1);
                return `${values[0]}-`;
              }}
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
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
