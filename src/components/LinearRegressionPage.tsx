import { ScatterRegressionChart } from "./ScatterRegressionChart";
import { LinearRegressionDataInput } from "@/components/LinearRegressionDataInput";
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

  let kCoefficientXZ = 0;
  let bCoefficientXZ = 0;

  let kCoefficientYZ = 0;
  let bCoefficientYZ = 0;

  if (seriesX && seriesZ) {
    const { k, b } = linearRegression(seriesX, seriesZ);

    kCoefficientXZ = k;
    bCoefficientXZ = b;
  }

  if (seriesY && seriesZ) {
    const { k, b } = linearRegression(seriesY, seriesZ);

    kCoefficientYZ = k;
    bCoefficientYZ = b;
  }

  return (
    <div className='space-y-6 p-6'>
      <h2 className='font-bold text-xl'>Ввод данных для регрессии</h2>
      <LinearRegressionDataInput onSubmit={handleSubmit} />
      <div className='flex gap-3 min-w-full'>
        {seriesX && seriesZ && (
          <div className='gap-3 w-1/2'>
            <ScatterRegressionChart
              X={seriesX}
              Y={seriesZ}
              xAxisLabel='X'
              yAxisLabel='Z'
              regressionCoefficients={{
                slope: kCoefficientXZ,
                intercept: bCoefficientXZ,
              }}
            ></ScatterRegressionChart>
          </div>
        )}
        {seriesY && seriesZ && (
          <div className='gap-3 w-1/2'>
            <ScatterRegressionChart
              X={seriesY}
              Y={seriesZ}
              xAxisLabel='Y'
              yAxisLabel='Z'
              regressionCoefficients={{
                slope: kCoefficientYZ,
                intercept: bCoefficientYZ,
              }}
            ></ScatterRegressionChart>
          </div>
        )}
      </div>
    </div>
  );
}
