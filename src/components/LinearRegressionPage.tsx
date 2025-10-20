import { ScatterRegressionChart } from "./regression/ScatterRegressionChart";
import { ResidualsGraph } from "./regression/ResidualsGraph";
import { LinearRegressionDataInput } from "@/components/regression/LinearRegressionDataInput";
import { useLinearRegressionSeries } from "@/context/LinearRegressionSeriesContext";
import { linearRegression } from "@/services/regression/regression";
import { VariationSeries } from "@/services/series/variationSeries";

export function LinearRegressionPage() {
  const { setSeries, seriesX, seriesY, seriesZ } = useLinearRegressionSeries();

  const handleSubmit = (
    x: Array<number>,
    y: Array<number>,
    z: Array<number>,
  ) => {
    setSeries(
      new VariationSeries(x),
      new VariationSeries(y),
      new VariationSeries(z),
    );
  };

  let resultXZ;
  let resultYZ;

  if (seriesX && seriesZ) {
    resultXZ = linearRegression(seriesX, seriesZ);
  }

  if (seriesY && seriesZ) {
    resultYZ = linearRegression(seriesY, seriesZ);
  }

  return (
    <div className='space-y-6 p-6'>
      <h2 className='font-bold text-xl'>Ввод данных для регрессии</h2>
      <LinearRegressionDataInput onSubmit={handleSubmit} />
      <div className='flex gap-3 min-w-full'>
        {seriesX && seriesZ && resultXZ && (
          <div className='flex flex-col gap-3 w-1/2'>
            <ScatterRegressionChart
              X={seriesX}
              Y={seriesZ}
              xAxisLabel='X'
              yAxisLabel='Z'
              regressionResult={resultXZ}
            ></ScatterRegressionChart>
            <ResidualsGraph residuals={resultXZ.residuals}></ResidualsGraph>
          </div>
        )}
        {seriesY && seriesZ && resultYZ && (
          <div className='flex flex-col gap-3 w-1/2'>
            <ScatterRegressionChart
              X={seriesY}
              Y={seriesZ}
              xAxisLabel='Y'
              yAxisLabel='Z'
              regressionResult={resultYZ}
            ></ScatterRegressionChart>
            <ResidualsGraph residuals={resultYZ.residuals}></ResidualsGraph>
          </div>
        )}
      </div>
    </div>
  );
}
