// components/Base3DPlot.tsx
import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

interface Base3DPlotProps {
  data: Array<Data>;
  layout?: Partial<Layout>;
  style?: React.CSSProperties;
}

const useThemeObserver = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    setIsDarkMode(document.documentElement.classList.contains('dark'));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

export const Base3DPlot: React.FC<Base3DPlotProps> = ({
  data,
  layout = {},
  style = { width: '100%', height: '600px' }
}) => {
  const isDarkMode = useThemeObserver();

  // Get theme colors
  const themeColors = isDarkMode
    ? {
      background: "#18181b",
      foreground: "#fafafa",
      border: "#303032",
      chart1: "#e1356f",
      card: "#09090b"
    }
    : {
      background: "#ffffff",
      foreground: "#09090b",
      border: "#a0a0a0",
      chart1: "#e4497e",
      card: "#fafafa"
    };

  // Base layout configuration
  const baseLayout: Partial<Layout> = {
    paper_bgcolor: themeColors.background,
    font: { color: themeColors.foreground },
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
    scene: {
      bgcolor: themeColors.background,
      xaxis: {
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border
      },
      yaxis: {
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border
      },
      zaxis: {
        gridcolor: themeColors.border,
        linecolor: themeColors.border,
        tickfont: { color: themeColors.foreground },
        zerolinecolor: themeColors.border
      },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.8 }
      }
    }
  };

  // Merge user-provided layout with base layout
  const mergedLayout = {
    ...baseLayout,
    ...layout,
    scene: {
      ...baseLayout.scene,
      ...layout.scene,
      xaxis: {
        ...baseLayout.scene?.xaxis,
        ...layout.scene?.xaxis
      },
      yaxis: {
        ...baseLayout.scene?.yaxis,
        ...layout.scene?.yaxis
      },
      zaxis: {
        ...baseLayout.scene?.zaxis,
        ...layout.scene?.zaxis
      },
      camera: {
        ...baseLayout.scene?.camera,
        ...layout.scene?.camera
      }
    }
  };

  return (
    <div
      className="border border-r-0 border-l-0 rounded-xl"
      style={{ backgroundColor: themeColors.background }}
      key={isDarkMode ? 'dark' : 'light'}
    >
      <Plot
        key={isDarkMode ? 'dark' : 'light'}
        data={data}
        layout={mergedLayout}
        style={style}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          displaylogo: false,
          toImageButtonOptions: {
            format: 'svg',
            filename: '3d_plot',
            height: 600,
            width: 800,
            scale: 2
          }
        }}
      />
    </div>
  );
};
