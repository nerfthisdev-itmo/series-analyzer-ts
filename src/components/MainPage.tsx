import { CdfGraph } from "./CdfGraph";
import { PolygonGraph } from "./PolygonGraph";
import { VariationSeries } from "@/services/variationSeries";

const data = new VariationSeries([
  2, 0, 1, 2, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 0, 4, 0, 0, 1, 0, 4, 1, 1, 0,
  2, 1, 0, 0, 2, 1, 1, 1, 1, 0, 1, 1, 0, 3, 1, 2, 1, 0, 1, 2, 1, 2, 3, 0, 2, 4,
  0, 0, 0, 3, 0, 2, 0, 2, 2, 2, 1, 1,
]);
const MainPage = () => {
  return (
    <div>
      <div className='flex gap-3 min-w-full'>
        <div className='w-1/2'>
          <CdfGraph variationSeries={data}></CdfGraph>
        </div>
        <div className='w-1/2'>
          <PolygonGraph variationSeries={data}></PolygonGraph>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
