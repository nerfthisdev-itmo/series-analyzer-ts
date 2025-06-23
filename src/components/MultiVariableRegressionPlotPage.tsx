import Regression3DPlot from "./regression/Regression3DPlot";
import { useLinearRegressionSeries } from "@/context/LinearRegressionSeriesContext";
import { multipleLinearRegression } from "@/services/regression/multipleLinearRegression";

export function MultiVariableRegressionPlotPage() {
  const { seriesX, seriesY, seriesZ } = useLinearRegressionSeries();

  // After running your regression
  if (!seriesX || !seriesY || !seriesZ) {
    return <div className='p-6 text-red-500'>
      Данные отсутствуют или ряды пусты. Введите данные на странице "/linear-regression".
    </div>
  }

  const result = multipleLinearRegression(seriesX, seriesY, seriesZ);

  const plotData = {
    X1: seriesX.initial_data,
    X2: seriesY.initial_data,
    Y: seriesZ.initial_data,
    coefficients: result.coefficients,
    residuals: result.residuals
  };

  return (
    <div className="regression-container">
      <h2>Regression Visualization</h2>
      <Regression3DPlot regressionData={plotData} />

      <div className="stats-panel">
        <p>R² = {result.R2.toFixed(4)}</p>
        <p>Adjusted R² = {result.adjR2.toFixed(4)}</p>
        <p>Equation: Y = {result.coefficients.intercept.toFixed(2)} +
          {result.coefficients.x1.toFixed(2)}X₁ +
          {result.coefficients.x2.toFixed(2)}X₂</p>
      </div>
    </div>
  );
}
