import { LinearRegressionDataInput } from "@/components/LinearRegressionDataInput";
import { useLinearRegressionSeries } from "@/context/LinearRegressionSeriesContext";
import { VariationSeries } from "@/services/series/variationSeries";

export function LinearRegressionPage() {
  const { setSeries } = useLinearRegressionSeries();

  const handleSubmit = (x: Array<number>, y: Array<number>, z: Array<number>) => {
    setSeries(new VariationSeries(x), new VariationSeries(y), new VariationSeries(z))
  }


  return (
    <div className="space-y-6 p-6">
      <h2 className="font-bold text-xl">Ввод данных для регрессии</h2>
      <LinearRegressionDataInput onSubmit={handleSubmit} />
    </div>
  );
}
