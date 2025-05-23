"use client";

import { CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import type { VariationSeries } from "@/services/variationSeries";
import type { DistributionType } from "@/services/seriesMath";
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
  theoretical_frequency: {
    label: "Theoretical Frequency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type PolygonGraphWithTheoreticalValuesEntry = {
  sample_value: string;
  number_of_occurrences: number;
  theoretical_value: number;
};

export function PolygonGraphWithTheoreticalValues({
  variationSeries,
  distribution,
}: {
  variationSeries: VariationSeries;
  distribution: DistributionType;
}) {
  const data = new Array<PolygonGraphWithTheoreticalValuesEntry>();
  const theoreticalFrequencies =
    variationSeries.getTheoreticalFrequencies(distribution);

  Object.entries(variationSeries.statisticalSeries).forEach(
    ([sample_value, number_of_occurrences], index) => {
      data.push({
        sample_value,
        number_of_occurrences,
        theoretical_value: theoreticalFrequencies[index],
      });
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Polygon chart</CardTitle>
        <CardDescription>
          Constructed by counting a number of occurrences of each value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='w-full min-h-[200px]'>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='sample_value'
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
              dataKey='number_of_occurrences'
              type='linear'
              stroke='var(--color-number_of_occurrences)'
              strokeWidth={2}
              dot={{
                fill: "var(--color-number_of_occurrences)",
              }}
              activeDot={{
                r: 6,
              }}
            />

            <Line
              dataKey='theoretical_value'
              type='natural'
              stroke='var(--color-theoretical_frequency)'
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
