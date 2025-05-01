"use client";

import { Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { VariationSeries } from "@/services/variationSeries";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
} satisfies ChartConfig;

export function CdfGraph({
  variationSeries,
  offset_from_min = 0.5,
}: {
  variationSeries: VariationSeries;
  offset_from_min?: number;
}) {
  const x_values = variationSeries.initial_data;

  let data = x_values.map((value) => ({
    value: value,
    probability: variationSeries.getCdf(value),
  }));

  data = [
    {
      value: variationSeries.min - offset_from_min,
      probability: 0,
    },
    ...data,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empirical distribution function</CardTitle>
        <CardDescription>
          Constructed by accumulating values from inputted values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="probability"
              type="step"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
