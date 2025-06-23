import { Regression3DPlot } from "./regression/3d/Regression3DPlot";
import { RegressionBadges } from "./regression/RegressionBadges";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLinearRegressionSeries } from "@/context/LinearRegressionSeriesContext";
import { multipleLinearRegression } from "@/services/regression/multipleLinearRegression";

export function MultiVariableRegressionPlotPage() {
  const { seriesX, seriesY, seriesZ } = useLinearRegressionSeries();

  if (!seriesX || !seriesY || !seriesZ) {
    return (
      <Card>
        <CardContent className="p-6 text-red-500">
          Данные отсутствуют или ряды пусты. Введите данные на странице "/linear-regression".
        </CardContent>
      </Card>
    );
  }

  const result = multipleLinearRegression(seriesX, seriesY, seriesZ);
  const n = seriesX.initial_data.length;

  const equation = `Y = ${result.coefficients.intercept.toFixed(2)} + ${result.coefficients.x1.toFixed(2)}X + ${result.coefficients.x2.toFixed(2)}Y`;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Multi-Variable Regression Visualization</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0 min-h-[500px]">
        <div className="w-full h-full">
          <Regression3DPlot regressionData={{
            X1: seriesX.initial_data,
            X2: seriesY.initial_data,
            Y: seriesZ.initial_data,
            coefficients: result.coefficients,
          }}
            x1Name="X"
            x2Name="Y"
            yName="Z"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3">
        <div className="flex gap-2 font-medium">
          <span className="flex-shrink-0 bg-[var(--chart-2)] mt-1.5 rounded-full w-3 h-3" />
          <span className="font-mono">{equation}</span>
        </div>

        <div className="mt-2 text-muted-foreground text-sm">
          Showing {n} data point{n !== 1 ? 's' : ''}
        </div>
        <RegressionBadges parameters={result} ></RegressionBadges>
      </CardFooter>
    </Card>
  );
}
