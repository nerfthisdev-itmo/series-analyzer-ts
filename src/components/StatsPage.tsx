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
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Статистические характеристики</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardContent className='p-4 space-y-4'>
            <h2 className='text-xl font-semibold text-center'>Ряд A</h2>
            <StatsTextRenderer distributions={["normal", "laplace"]} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 space-y-4'>
            <h2 className='text-xl font-semibold text-center'>Ряд B</h2>
            <StatsTextRenderer
              distributions={["normal", "binomial"]}
              useSeries='B'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;
