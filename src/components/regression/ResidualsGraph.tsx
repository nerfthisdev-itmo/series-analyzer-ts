"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

import { max, min } from "mathjs";
import { GaussMarkovAssumptionsBadges } from "./GaussMarkovAssumptionsBadges";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { analyzeResiduals } from "@/services/regression/gaussMarkovAssumptions";
import { VariationSeries } from "@/services/series/variationSeries";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ResidualsGraph({
  residuals,
}: {
  residuals: Array<{ x: number; y: number }>;
}) {
  const gaussMarkov = analyzeResiduals(
    new VariationSeries(residuals.map((value) => value.y)),
  );

  const xMin = min(residuals.map((value) => value.x));
  const xMax = max(residuals.map((value) => value.x));

  const xRange = xMax - xMin

  const xDomain = [xMin - xRange * 0.1, xMax + xRange * 0.1]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Residuals graph</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='w-full min-h-[200px]'>
          <ScatterChart
            accessibilityLayer
            data={residuals}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='x'
              type='number'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={xDomain}
            />
            <YAxis
              dataKey='y'
              type='number'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Scatter
              dataKey='y'
              type='linear'
              stroke='var(--color-value)'
              strokeWidth={2}
              shape='circle'
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex flex-col items-start gap-2 border-t text-sm'>
        <GaussMarkovAssumptionsBadges
          parameters={gaussMarkov}
        ></GaussMarkovAssumptionsBadges>
      </CardFooter>
    </Card>
  );
}
