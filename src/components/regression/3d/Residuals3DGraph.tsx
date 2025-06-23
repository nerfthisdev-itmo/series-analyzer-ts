"use client";

import { GaussMarkovAssumptionsBadges } from "../GaussMarkovAssumptionsBadges";
import { Base3DPlot } from "./Base3DPlot";
import type { Data, Layout } from "plotly.js";
import { analyzeResiduals } from "@/services/regression/gaussMarkovAssumptions";
import { VariationSeries } from "@/services/series/variationSeries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Residual3D = {
  x1: number;
  x2: number;
  y: number;  // Residual value
};

interface Residuals3DGraphProps {
  residuals: Array<Residual3D>;
  xName?: string;
  yName?: string;
  zName?: string;
}

export function Residuals3DGraph({
  residuals,
  xName = "X",
  yName = "Y",
  zName = "Residual Value"
}: Residuals3DGraphProps) {

  const gaussMarkov = analyzeResiduals(
    new VariationSeries(residuals.map(r => r.y))
  );

  // Prepare plot data
  const plotData: Array<Data> = [{
    x: residuals.map(r => r.x1),
    y: residuals.map(r => r.x2),
    z: residuals.map(r => r.y),
    type: 'scatter3d',
    mode: 'markers',
    marker: {
      size: 5,
      color: "hsl(var(--chart-1))",
      opacity: 0.8,
    },
  }];

  // Prepare layout
  const plotLayout: Partial<Layout> = {
    autosize: true,
    margin: { t: 0, b: 0, l: 0, r: 0 },
    scene: {
      xaxis: { title: { text: xName } },
      yaxis: { title: { text: yName } },
      zaxis: { title: { text: zName } },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.8 }
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>3D Residuals Visualization</CardTitle>
        <CardDescription>
          Residual distribution across two independent variables
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        <Base3DPlot
          data={plotData}
          layout={plotLayout}
          style={{ width: '100%', height: '400px' }}
        />
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4">
        <GaussMarkovAssumptionsBadges parameters={gaussMarkov} />
      </CardFooter>
    </Card>
  );
}
