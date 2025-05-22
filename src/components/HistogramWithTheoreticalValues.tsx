"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ComposedChart, LabelList, Line, XAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import type { VariationSeries } from "@/services/variationSeries";
import type { IntervalVariationSeries } from "@/services/intervalSeries";
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

type HistogramWithTheoreticalValuesEntry = {
    bin_center: number;
    number_of_occurrences: number;
    theoretical_frequency: number;
};

export function HistogramWithTheoreticalValues({
    intervalVariationSeries,
}: {
    intervalVariationSeries: IntervalVariationSeries;
}) {
    const chartData = new Array<HistogramWithTheoreticalValuesEntry>();
    const theoretical_frequencies = intervalVariationSeries.getTheoreticalFrequencies()

    Object.entries(intervalVariationSeries.statisticalSeries).forEach(
        ([bin_center, number_of_occurrences]: [string, number], index) => {
            chartData.push({ bin_center: parseFloat(bin_center), number_of_occurrences, theoretical_frequency: theoretical_frequencies[index] });
        },
    );

    const x_domain = [intervalVariationSeries.binCenters[0], intervalVariationSeries.binCenters[intervalVariationSeries.n - 1]]



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
                        // tickFormatter={(value: string) => {
                        //     const values = value.split(", ");
                        //     values[0] = values[0].slice(1);
                        //     return `${values[0]}-`;
                        // }}
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

                        <Line
                            dataKey='theoretical_frequency'
                            stroke='var(--color-theoretical_frequency)'
                            type='natural'
                            strokeWidth={2}
                            dot={false}
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
