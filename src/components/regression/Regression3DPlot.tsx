import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';
import type { MultipleRegressionCoefficients } from '@/services/regression/multipleLinearRegression';

interface RegressionData {
  X1: Array<number>;
  X2: Array<number>;
  Y: Array<number>;
  coefficients: MultipleRegressionCoefficients;
}

interface Regression3DPlotProps {
  regressionData: RegressionData;
}

const Regression3DPlot: React.FC<Regression3DPlotProps> = ({ regressionData }) => {
  const { X1, X2, Y, coefficients } = regressionData;
  const b0 = coefficients.intercept
  const b1 = coefficients.x1
  const b2 = coefficients.x2

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

  // Generate regression plane grid (corrected)
  const zGrid = x2Grid.map(x2 =>
    x1Grid.map(x1 => b0 + b1 * x1 + b2 * x2)
  );

  // Prepare traces with proper typing
  const traces: Array<Data> = [
    // Regression plane
    {
      type: 'surface',
      x: x1Grid,
      y: x2Grid,
      z: zGrid,
      colorscale: 'Blues',
      opacity: 0.7,
      name: 'Regression Plane',
      showscale: false,
      hoverinfo: 'none'
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
        color: '#d62728',
        opacity: 0.9
      },
      name: 'Observed Data',
      hoverinfo: 'x+y+z+name'
    }
  ];

  // Define layout with proper typing
  const layout: Partial<Layout> = {
    title: { text: 'Multiple Linear Regression' }, // Correct title format
    autosize: true,
    scene: {
      xaxis: { title: { text: 'X1 Variable' } },
      yaxis: { title: { text: 'X2 Variable' } },
      zaxis: { title: { text: 'Y Response' } },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.8 }
      }
    },
    margin: { t: 40, b: 0, l: 0, r: 0 },
    showlegend: true,
    legend: {
      x: 0.8,
      y: 0.9,
      bgcolor: 'rgba(255,255,255,0.5)'
    }
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: '100%', height: '600px' }}
      config={{
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        displaylogo: false
      }}
    />
  );
};

export default Regression3DPlot;
