"use client";

import { CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { TheoreticalDistributionData } from "../ui/distributions/TheoreticalDistributionData";
import type { ChartConfig } from "@/components/ui/chart";
import type { VariationSeries } from "@/services/series/variationSeries";
import type { PearsonResult } from "@/services/statistical-tests/pearson-test/pearsonTest";
import type { KSTestResult } from "@/services/statistical-tests/kolmogorov-smirnov-test/ksTest";
import type {
  DistributionType,
  SomeTheoreticalDistribution,
} from "@/services/types/distributions";
import { getTheoreticalDistribution } from "@/services/types/distributions";
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
import { getBestDistributionType } from "@/services/distributions/getBestDistribution";
import { calculateDiscreteTheoreticalFrequencies } from "@/services/distributions/theoreticalFrequencies";

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

type PolygonGraphEntry = {
  sample_value: number;
  number_of_occurrences: number;
};

type PolygonGraphWithTheoreticalValuesEntry = PolygonGraphEntry & {
  theoretical_value: number;
};

export function Polygon({
  variationSeries,
  distributionType,
}: {
  variationSeries: VariationSeries;
  distributionType?: "auto" | DistributionType;
}) {
  const data = new Array<
    PolygonGraphEntry | PolygonGraphWithTheoreticalValuesEntry
  >();

  let characteristics: SomeTheoreticalDistribution | undefined = undefined;
  let bestDistributionResult:
    | {
        type: DistributionType;
        result: PearsonResult;
      }
    | {
        type: DistributionType;
        result: KSTestResult;
      }
    | undefined = undefined;
  let resolvedDistributionType: DistributionType | undefined;

  if (distributionType == "auto") {
    bestDistributionResult = getBestDistributionType(variationSeries);
    resolvedDistributionType = bestDistributionResult?.type;
  } else {
    resolvedDistributionType = distributionType;
  }

  if (resolvedDistributionType != undefined) {
    const theory = getTheoreticalDistribution(resolvedDistributionType);
    characteristics =
      theory.getCharacteristicsFromEmpiricalData(variationSeries);

    const theoreticalFrequencies = Object.values(
      calculateDiscreteTheoreticalFrequencies(
        characteristics,
        theory,
        Object.keys(variationSeries.getStatisticalSeries()).map(parseFloat),
      ),
    );

    Object.entries(variationSeries.getStatisticalSeries()).forEach(
      ([sample_value, number_of_occurrences], index) => {
        data.push({
          sample_value: parseFloat(sample_value),
          number_of_occurrences,
          theoretical_value: theoreticalFrequencies[index],
        } satisfies PolygonGraphWithTheoreticalValuesEntry);
      },
    );
  } else {
    Object.entries(variationSeries.getStatisticalSeries()).forEach(
      ([sample_value, number_of_occurrences]) => {
        data.push({
          sample_value: parseFloat(sample_value),
          number_of_occurrences,
        } satisfies PolygonGraphEntry);
      },
    );
  }

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
              type='number'
              dataKey='sample_value'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
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

            {distributionType != undefined ? (
              <Line
                dataKey='theoretical_value'
                type='natural'
                stroke='var(--color-theoretical_frequency)'
                strokeWidth={2}
                dot={false}
              />
            ) : (
              <></>
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      {resolvedDistributionType && characteristics && (
        <CardFooter className='border-t'>
          <TheoreticalDistributionData
            resolvedDistributionType={resolvedDistributionType}
            characteristics={characteristics}
            bestDistributionResult={bestDistributionResult}
          ></TheoreticalDistributionData>
        </CardFooter>
      )}
    </Card>
  );
}
