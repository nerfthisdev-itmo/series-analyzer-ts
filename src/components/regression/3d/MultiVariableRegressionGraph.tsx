import { RegressionBadges } from "../RegressionBadges";
import { Regression3DPlot } from "./Regression3DPlot";
import type { MultipleRegressionResult } from "@/services/regression/multipleLinearRegression";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MultiVariableRegressionPlotCardProps {
  X1: Array<number>;
  X2: Array<number>;
  Y: Array<number>;
  result: MultipleRegressionResult
  x1Name: "X"
  x2Name: "Y"
  yName: "Z"
}

export function MultiVariableRegressionPlotCard({
  X1,
  X2,
  Y,
  result,
  x1Name,
  x2Name,
  yName,
}: MultiVariableRegressionPlotCardProps) {

  const equation = `${yName} = ${result.coefficients.intercept.toFixed(2)} + ${result.coefficients.x1.toFixed(2)}${x1Name} + ${result.coefficients.x2.toFixed(2)}${x2Name}`;
  const n = X1.length;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Multi-Variable Regression Visualization</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0 min-h-[500px]">
        <div className="w-full h-full">
          <Regression3DPlot
            regressionData={{
              X1: X1,
              X2: X2,
              Y: Y,
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
        <RegressionBadges parameters={result} />
      </CardFooter>
    </Card>
  );
}
