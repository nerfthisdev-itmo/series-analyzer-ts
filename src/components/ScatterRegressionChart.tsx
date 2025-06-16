"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

export const description = "Scatter plot with linear regression line"

type RegressionCoefficients = {
  slope: number;
  intercept: number;
};

export type ChartDataPoint = {
  x: number;
  y: number;
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
  // Generate chart data
  const chartData: Array<ChartDataPoint> = X.initial_data.map((xVal, i) => ({
    x: xVal,
    y: Y.initial_data[i],
  }));

  const regressionLine = [
    { x: X.min, y: regressionCoefficients.slope * X.min + regressionCoefficients.intercept },
    { x: X.max, y: regressionCoefficients.slope * X.max + regressionCoefficients.intercept },
  ];

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      // Filter out regression line
      const scatterEntry = payload.find((item: any) => item.name !== "Regression Line");
      if (!scatterEntry) return null;

      const point = scatterEntry.payload;

      return (
        <div className="bg-white shadow-sm p-2 border rounded w-[180px]">
          {/* X Value Entry */}
          <div className="flex items-baseline gap-2 mb-1">
            <div
              className="rounded-[2px] w-2.5 h-2.5 shrink-0"
              style={{ backgroundColor: `var(--chart-1)` }}
            />
            <span className="font-medium text-sm">{xAxisLabel}</span>
            <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
              {point.x}
            </span>
            <span className="text-muted-foreground text-sm">units</span>
          </div>

          {/* Y Value Entry */}
          <div className="flex items-baseline gap-2 mb-1">
            <div
              className="rounded-[2px] w-2.5 h-2.5 shrink-0"
              style={{ backgroundColor: `var(--chart-1)` }}
            />
            <span className="font-medium text-sm">{yAxisLabel}</span>
            <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
              {point.y}
            </span>
            <span className="text-muted-foreground text-sm">units</span>
          </div>

          {/* Optional Total Section */}
          <div className="flex items-center mt-1.5 pt-1.5 border-t font-medium text-foreground text-xs">
            Total
            <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
              {(point.x + point.y).toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">units</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Plot with Regression Line</CardTitle>
        <CardDescription>{`${xAxisLabel} vs ${yAxisLabel}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='w-full min-h-[200px]'>
          <ComposedChart>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            {/* X Axis */}
            <XAxis
              type="number"
              dataKey="x"
              name={xAxisLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
              domain={[X.min, X.max]}  // Explicitly set domain to match data
              padding={{ left: 0, right: 0 }}  // Remove padding
            />

            <YAxis
              type="number"
              dataKey="y"
              name={yAxisLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
              domain={['dataMin', 'dataMax']}  // Auto-scale to include all data
              padding={{ top: 0, bottom: 0 }}  // Remove padding
            />

            {/* Data Points */}
            <Scatter
              name="Data Points"
              data={chartData}
              fill="hsl(var(--chart-1))"
              shape="circle"
              r={6}
            />

            {/* Regression Line */}
            <Line
              type="linear"
              dataKey="y"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              data={regressionLine}
              name="Regression Line"
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <span className="inline-flex items-center gap-1">
            <span className="bg-[var(--color-regression)] rounded-full w-3 h-3" />
            y = {regressionCoefficients.slope.toFixed(2)}x + {regressionCoefficients.intercept.toFixed(2)}
          </span>
        </div>
        <div className="text-muted-foreground leading-none">
          Showing {chartData.length} data points with regression line
        </div>
      </CardFooter>
    </Card >
  )
}
