import MeanVarTestCard from "./ui/MeanVarTestCard";
import StatsTextRenderer from "@/components/ui/StatsTextRenderer";
import SplitTTestCard from "@/components/ui/SplitTTestCard"; // ⬅️ НОВЫЙ импорт
import { useVariationSeries } from "@/context/VariationSeriesContext";
import { Card, CardContent } from "@/components/ui/card";

const StatsPage = () => {
  const { seriesA, seriesB, distsA, distsB } = useVariationSeries();

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

      {/* ───────── 1. таблицы сравнения эмпирика-vs-теория ───────── */}
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

      {/* ───────── 2. t-тест «первая половина vs вторая» ───────── */}
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        <SplitTTestCard
          title='t-тест: Ряд A (половины)'
          series={seriesA}
          alpha={0.05} // можно опустить, по-умолчанию 0.05
        />
        <SplitTTestCard
          title='t-тест: Ряд B (половины)'
          series={seriesB}
          alpha={0.05}
        />
      </div>
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        <MeanVarTestCard
          title='μ & σ²: Ряд A'
          series={seriesA}
          distType={distsA[0]}
        />
        <MeanVarTestCard
          title='μ & σ²: Ряд B'
          series={seriesB}
          distType={distsB[0]}
        />
      </div>
    </div>
  );
};

export default StatsPage;
