"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

import type { VariationSeries } from "@/services/series/variationSeries"
import type { ChartConfig } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
} from "@/components/ui/chart"

export const description = "Scatter plot with linear regression line"

type RegressionCoefficients = {
  slope: number;
  intercept: number;
};

export type ChartDataPoint = {
  x: number;
  y: number;
  type: 'data' | 'regression';
};

export const chartConfig = {
  data: {
    label: "Data Points",
    color: "var(--chart-1)",
  },
  regression: {
    label: "Regression Line",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ScatterRegressionChart({
  X,
  Y,
  regressionCoefficients,
  xAxisLabel = "X",
  yAxisLabel = "Y",
}: {
  X: VariationSeries;
  Y: VariationSeries;
  regressionCoefficients: RegressionCoefficients;
  xAxisLabel?: string;
  yAxisLabel?: string;
}) {
  // Generate chart data with type identifier
  const chartData: Array<ChartDataPoint> = X.initial_data.map((xVal, i) => ({
    x: xVal,
    y: Y.initial_data[i],
    type: 'data'
  }));

  const yMin = Y.min;
  const yMax = Y.max;

  // Calculate regression points
  const regressionLine = [
    { x: X.min, y: regressionCoefficients.slope * X.min + regressionCoefficients.intercept },
    { x: X.max, y: regressionCoefficients.slope * X.max + regressionCoefficients.intercept },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const dataPoint = payload.find((p: any) => p.payload.type === 'data');
    if (!dataPoint) return null;

    const point = dataPoint.payload;

    return (
      <div className="bg-background shadow-sm p-2 border rounded-md w-[180px]">
        {/* X Value Entry */}
        <div className="flex items-center gap-2">
          <div
            className="rounded-[2px] w-2.5 h-2.5 shrink-0"
            style={{ backgroundColor: `var(--chart-1)` }}
          />
          <span className="font-medium text-sm">{xAxisLabel}</span>
          <div className="flex items-baseline gap-0.5 ml-auto font-mono font-medium tabular-nums text-foreground">
            {point.x.toFixed(2)}
          </div>
        </div>

        {/* Y Value Entry */}
        <div className="flex items-center gap-2 mt-1.5">
          <div
            className="rounded-[2px] w-2.5 h-2.5 shrink-0"
            style={{ backgroundColor: `var(--chart-1)` }}
          />
          <span className="font-medium text-sm">{yAxisLabel}</span>
          <div className="flex items-baseline gap-0.5 ml-auto font-mono font-medium tabular-nums text-foreground">
            {point.y.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Plot with Regression Line</CardTitle>
        <CardDescription>{`${xAxisLabel} vs ${yAxisLabel}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='w-full min-h-[200px]'>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                type="number"
                dataKey="x"
                name={xAxisLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(2)}
                domain={[X.min, X.max]}
              />

              <YAxis
                type="number"
                dataKey="y"
                name={yAxisLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(2)}
                domain={[yMin, yMax]}
              />

              {/* Regression Line */}
              <Line
                data={regressionLine}
                dataKey="y"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="Regression Line"
              />

              {/* Data Points */}
              <Scatter
                name="Data Points"
                data={chartData}
                fill="hsl(var(--chart-1))"
                shape="circle"
                r={6}
              />

              {/* Tooltip */}
              <Tooltip content={<CustomTooltip />} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <span className="inline-flex items-center gap-1">
            <span className="bg-[var(--chart-2)] rounded-full w-3 h-3" />
            y = {regressionCoefficients.slope.toFixed(2)}x + {regressionCoefficients.intercept.toFixed(2)}
          </span>
        </div>
        <div className="text-muted-foreground leading-none">
          Showing {chartData.length} data points with regression line
        </div>
      </CardFooter>
    </Card>
  )
}
