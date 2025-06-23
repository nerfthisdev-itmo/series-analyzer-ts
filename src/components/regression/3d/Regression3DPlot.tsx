import React from 'react';
import { Base3DPlot } from './Base3DPlot';
import type { Data, Layout } from 'plotly.js';
import type { MultipleRegressionCoefficients } from '@/services/regression/multipleLinearRegression';
import { useThemeColors } from '@/hooks/useThemeColors';

interface RegressionData {
  X1: Array<number>;
  X2: Array<number>;
  Y: Array<number>;
  coefficients: MultipleRegressionCoefficients;
}

interface Regression3DPlotProps {
  regressionData: RegressionData;
  x1Name?: string;
  x2Name?: string;
  yName?: string;
}

export const Regression3DPlot: React.FC<Regression3DPlotProps> = ({
  regressionData,
  x1Name = 'X1',
  x2Name = 'X2',
  yName = 'Y'
}) => {

  const themeColors = useThemeColors();

  const { X1, X2, Y, coefficients } = regressionData;
  const b0 = coefficients.intercept;
  const b1 = coefficients.x1;
  const b2 = coefficients.x2;

  // Generate regression plane grid
  const x1Range = [Math.min(...X1), Math.max(...X1)];
  const x2Range = [Math.min(...X2), Math.max(...X2)];
  const gridSize = 20;

  const x1Grid = Array.from({ length: gridSize }, (_, i) =>
    x1Range[0] + i * (x1Range[1] - x1Range[0]) / (gridSize - 1)
  );

  const x2Grid = Array.from({ length: gridSize }, (_, j) =>
    x2Range[0] + j * (x2Range[1] - x2Range[0]) / (gridSize - 1)
  );

  const zGrid = x2Grid.map(x2 =>
    x1Grid.map(x1 => b0 + b1 * x1 + b2 * x2)
  );

  // Prepare traces
  const traces: Array<Data> = [
    // Regression plane
    {
      type: 'surface',
      x: x1Grid,
      y: x2Grid,
      z: zGrid,
      opacity: 0.4,
      name: 'Regression Plane',
      showscale: false,
      showlegend: true,
      hoverinfo: 'skip',
      colorscale: 'Viridis'
    },
    // Observed data points
    {
      type: 'scatter3d',
      mode: 'markers',
      x: X1,
      y: X2,
      z: Y,
      marker: {
        size: 5,
        opacity: 0.9,
        line: { width: 0.5 },
        color: themeColors.chart1
      },
      name: 'Observed Data',
      hovertemplate:
        `<b>${x1Name}</b>: %{x:.4f}<br>` +
        `<b>${x2Name}</b>: %{y:.4f}<br>` +
        `<b>${yName}</b>: %{z:.4f}<br>` +
        `<extra></extra>`
    }
  ];

  // Layout customizations specific to this plot
  const layoutOverrides: Partial<Layout> = {
    margin: { t: 0, b: 0, l: 0, r: 0 },
    scene: {
      xaxis: { title: { text: x1Name } },
      yaxis: { title: { text: x2Name } },
      zaxis: { title: { text: yName } },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.8 }
      }
    }
  };

  // Plot configuration options
  const plotConfig = {
    toImageButtonOptions: {
      filename: 'regression_plot',
      format: 'svg',
      height: 600,
      width: 800,
      scale: 2
    }
  };

  return (
    <Base3DPlot
      data={traces}
      layout={layoutOverrides}
      config={plotConfig}
    />
  );
};
