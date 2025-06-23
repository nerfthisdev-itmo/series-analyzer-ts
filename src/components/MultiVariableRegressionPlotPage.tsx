import { MultiVariableRegressionPlotCard } from "./regression/3d/MultiVariableRegressionGraph";
import { Residuals3DGraph } from "./regression/3d/Residuals3DGraph";
import { useLinearRegressionSeries } from "@/context/LinearRegressionSeriesContext";
import { multipleLinearRegression } from "@/services/regression/multipleLinearRegression";
import { Card, CardContent } from "@/components/ui/card";

export function MultiVariableRegressionPlotPage() {
  const { seriesX, seriesY, seriesZ } = useLinearRegressionSeries();

  if (!seriesX || !seriesY || !seriesZ) {
    return (
      <div className='h-full min-h-[500px]'>
        <Card>
          <CardContent className='p-6 text-red-500'>
            Данные отсутствуют или ряды пусты. Введите данные на странице
            "/linear-regression".
          </CardContent>
        </Card>
      </div>
    );
  }

  const result = multipleLinearRegression(seriesX, seriesY, seriesZ);

  return (
    <div className='h-full min-h-[600px]'>
      <MultiVariableRegressionPlotCard
        X1={seriesX.initial_data}
        X2={seriesY.initial_data}
        Y={seriesZ.initial_data}
        result={result}
        x1Name={"X"}
        x2Name={"Y"}
        yName={"Z"}
      />
      <Residuals3DGraph residuals={result.residuals}></Residuals3DGraph>
    </div>
  );
}
