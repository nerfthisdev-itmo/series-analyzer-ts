import { DataInput } from "./ui/DataInput";
import { CdfGraph } from "./CdfGraph";
import { CumulativeGraph } from "./CumulativeGraph";
import { OgiveGraph } from "./OgiveGraph";
import { HistogramWithTheoreticalValues } from "./HistogramWithTheoreticalValues";
import { PolygonGraphWithTheoreticalValues } from "./PolygonGraphWithTheoreticalValues";
import { VariationSeries } from "@/services/variationSeries";
import { useVariationSeries } from "@/context/VariationSeriesContext";
import { IntervalVariationSeries } from "@/services/intervalSeries";

const MainPage = () => {
  const { seriesA, seriesB, setSeries } = useVariationSeries();

  const handleSubmit = (a: Array<number>, b: Array<number>) => {
    const varA = new VariationSeries(a);
    const varB = new IntervalVariationSeries(b);
    setSeries(varA, varB);
  };

  return (
    <div className='space-y-6 p-6'>
      <DataInput onSubmit={handleSubmit} />
      {seriesA && seriesB && (
        <div className='flex gap-3 min-w-full'>
          <div className='gap-3 w-1/2'>
            <PolygonGraphWithTheoreticalValues
              variationSeries={seriesA}
              distributionType='binomial'
            />
            <CdfGraph variationSeries={seriesA} />
          </div>
          <div className='gap-3 w-1/2'>
            <HistogramWithTheoreticalValues intervalVariationSeries={seriesB} distributionType="normal" />
            <CumulativeGraph intervalVariationSeries={seriesB} />
            <OgiveGraph intervalVariationSeries={seriesB} />
          </div>
        </div>
      )}
    </div>
  );
};
export default MainPage;
