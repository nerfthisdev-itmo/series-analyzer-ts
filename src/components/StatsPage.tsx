import StatsTextRenderer from "@/components/ui/StatsTextRenderer";
import { useVariationSeries } from "@/context/VariationSeriesContext";
import { Card, CardContent } from "@/components/ui/card";

const StatsPage = () => {
  const { seriesA, seriesB } = useVariationSeries();

  if (!seriesA || !seriesB) {
    return (
      <div className='p-6 text-red-500'>
        Данные отсутствуют или ряды пусты. Введите данные на главной странице.
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-bold text-2xl'>Статистические характеристики</h1>
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        <Card>
          <CardContent className='space-y-4 p-4'>
            <h2 className='font-semibold text-xl text-center'>Ряд A</h2>
            <StatsTextRenderer useSeries='A' />
          </CardContent>
        </Card>

        <Card>
          <CardContent className='space-y-4 p-4'>
            <h2 className='font-semibold text-xl text-center'>Ряд B</h2>
            <StatsTextRenderer useSeries='B' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;
