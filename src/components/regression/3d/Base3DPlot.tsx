// components/Base3DPlot.tsx
import React from "react";
import Plot from "react-plotly.js";
import type { Data, Layout } from "plotly.js";
import { useThemeColors } from "@/hooks/useThemeColors"; // Adjust the import path

interface Base3DPlotProps {
  data: Array<Data>;
  layout?: Partial<Layout>;
  style?: React.CSSProperties;
  config?: any;
}

export const Base3DPlot: React.FC<Base3DPlotProps> = ({
  data,
  layout = {},
  style = { width: "100%", height: "600px" },
  config = {},
}) => {
  const themeColors = useThemeColors();

  // Base layout configuration
  const baseLayout: Partial<Layout> = {
    paper_bgcolor: themeColors.background,
    plot_bgcolor: themeColors.background,
    font: {
      color: themeColors.foreground,
      family: "Inter, sans-serif",
    },
    margin: { t: 40, b: 40, l: 40, r: 40 },
    showlegend: true,
    legend: {
      x: 0.9,
      y: 0.9,
      bgcolor: themeColors.card,
      bordercolor: themeColors.border,
      borderwidth: 1,
      font: { size: 12, color: themeColors.foreground },
      orientation: "v",
      xanchor: "right",
      yanchor: "top",
    },
    scene: {
      bgcolor: themeColors.background,
      xaxis: {
        title: { font: { size: 14 } },
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border,
      },
      yaxis: {
        title: { font: { size: 14 } },
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border,
      },
      zaxis: {
        title: { font: { size: 14 } },
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border,
      },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.8 },
      },
    },
    hoverlabel: {
      bgcolor: themeColors.card,
      bordercolor: themeColors.border,
      font: { color: themeColors.foreground },
    },
  };

  // Merge layouts
  const mergedLayout = {
    ...baseLayout,
    ...layout,
    scene: {
      ...baseLayout.scene,
      ...layout.scene,
      xaxis: {
        ...baseLayout.scene?.xaxis,
        ...layout.scene?.xaxis,
      },
      yaxis: {
        ...baseLayout.scene?.yaxis,
        ...layout.scene?.yaxis,
      },
      zaxis: {
        ...baseLayout.scene?.zaxis,
        ...layout.scene?.zaxis,
      },
      camera: {
        ...baseLayout.scene?.camera,
        ...layout.scene?.camera,
      },
    },
  };

  // Default config
  const defaultConfig = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
    displaylogo: false,
    toImageButtonOptions: {
      format: "svg",
      filename: "3d_plot",
      height: 600,
      width: 800,
      scale: 2,
    },
  };

  return (
    <div
      className='border border-r-0 border-l-0 rounded-xl overflow-hidden'
      style={{ backgroundColor: themeColors.background }}
    >
      <Plot
        key={themeColors.background} // Re-render when theme changes
        data={data}
        layout={mergedLayout}
        style={style}
        config={{ ...defaultConfig, ...config }}
      />
    </div>
  );
};
