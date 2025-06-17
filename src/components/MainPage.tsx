import { CdfGraph } from "./distributions/CdfGraph";
import { CumulativeGraph } from "./distributions/CumulativeGraph";
import { OgiveGraph } from "./distributions/OgiveGraph";
import { Histogram } from "./distributions/Histogram";
import DistributionPairSelect from "./ui/distributions/DistributionPairSelect";
import { DataInput } from "./ui/DataInput";
import { Polygon } from "./distributions/Polygon";
import { VariationSeries } from "@/services/series/variationSeries";
import { IntervalVariationSeries } from "@/services/series/intervalSeries";
import { useVariationSeries } from "@/context/VariationSeriesContext";

const MainPage = () => {
  const { seriesA, seriesB, setSeries, distsA, distsB, setDistsA, setDistsB } =
    useVariationSeries();

  /** обработчик ввода чисел */
  const handleSubmit = (a: Array<number>, b: Array<number>) => {
    setSeries(new VariationSeries(a), new IntervalVariationSeries(b));
  };

  return (
    <div className='space-y-6 p-6'>
      <DataInput onSubmit={handleSubmit} />

      <div className='flex gap-6'>
        <DistributionPairSelect
          label='Гипотезы для ряда A'
          value={distsA}
          onChange={setDistsA}
        />
        <DistributionPairSelect
          label='Гипотезы для ряда B'
          value={distsB}
          onChange={setDistsB}
        />
      </div>

      {/* графики показываем только когда есть данные */}
      {seriesA && seriesB && (
        <div className='flex gap-3 min-w-full'>
          <div className='gap-3 w-1/2'>
            <Polygon variationSeries={seriesA} distributionType='auto' />
            <CdfGraph variationSeries={seriesA} />
          </div>
          <div className='gap-3 w-1/2'>
            <Histogram
              intervalVariationSeries={seriesB}
              distributionType='auto'
            />
            <CumulativeGraph intervalVariationSeries={seriesB} />
            <OgiveGraph intervalVariationSeries={seriesB} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
