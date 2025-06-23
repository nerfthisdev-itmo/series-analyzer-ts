import React, { useEffect, useState } from 'react';
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
  /** Custom name for the first predictor variable (X1) */
  x1Name?: string;
  /** Custom name for the second predictor variable (X2) */
  x2Name?: string;
  /** Custom name for the response variable (Y) */
  yName?: string;
}

// Custom hook to detect theme changes
const useThemeObserver = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    // Initial check
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};


export const Regression3DPlot: React.FC<Regression3DPlotProps> = ({
  regressionData,
  x1Name = 'X1',
  x2Name = 'X2',
  yName = 'Y'
}) => {
  const isDarkMode = useThemeObserver();
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

  const zGrid = x2Grid.map(x2 =>
    x1Grid.map(x1 => b0 + b1 * x1 + b2 * x2)
  );

  // Get current theme colors
  let themeColors = {
    background: "#18181b",
    foreground: "#fafafa",
    border: "#09090b",
    chart1: "#e1356f",
    card: "#09090b"
  };
  if (isDarkMode) {
    themeColors = {
      background: "#18181b",
      foreground: "#fafafa",
      border: "#303032",
      chart1: "#e1356f",
      card: "#09090b"
    }
  } else {
    themeColors = {
      background: "#ffffff",
      foreground: "#09090b",
      border: "#a0a0a0",
      chart1: "#e4497e",
      card: "#fafafa"
    };
  }

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
      hoverinfo: 'skip'
    },
    // Observed data points with custom hover info
    {
      type: 'scatter3d',
      mode: 'markers',
      x: X1,
      y: X2,
      z: Y,
      marker: {
        size: 5,
        color: themeColors.chart1,
        opacity: 0.9,
        line: {
          color: themeColors.foreground,
          width: 0.5
        }
      },
      name: 'Observed Data',
      // Custom hover template using variable names
      hovertemplate:
        `<b>${x1Name}</b>: %{x:.4f}<br>` +
        `<b>${x2Name}</b>: %{y:.4f}<br>` +
        `<b>${yName}</b>: %{z:.4f}<br>` +
        `<extra></extra>`
    }
  ];

  // Define layout with simplified axis names
  const layout: Partial<Layout> = {
    paper_bgcolor: themeColors.background,
    font: { color: themeColors.foreground },
    scene: {
      bgcolor: themeColors.background,
      xaxis: {
        title: { text: x1Name, font: { color: themeColors.foreground } },
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border
      },
      yaxis: {
        title: { text: x2Name, font: { color: themeColors.foreground } },
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border
      },
      zaxis: {
        title: { text: yName, font: { color: themeColors.foreground } },
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border
      },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.8 }
      }
    },
    margin: { t: 0, b: 0, l: 0, r: 0 },
    showlegend: true,
    legend: {
      x: 0.8,
      y: 0.9,
      bgcolor: themeColors.card,
      bordercolor: themeColors.border,
      borderwidth: 1,
      font: { color: themeColors.foreground }
    },
  };

  return (
    <div
      className="border border-r-0 border-l-0 rounded-xl"
      style={{
        backgroundColor: themeColors.background
      }}
      key={isDarkMode ? 'dark' : 'light'}
    >
      <Plot
        key={isDarkMode ? 'dark' : 'light'}
        data={traces}
        layout={layout}
        style={{ width: '100%', height: '600px' }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          displaylogo: false,
          toImageButtonOptions: {
            format: 'svg',
            filename: 'regression_plot',
            height: 600,
            width: 800,
            scale: 2
          }
        }}
      />
    </div>
  );
};
