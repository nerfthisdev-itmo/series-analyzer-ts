import { createFileRoute } from '@tanstack/react-router';
import { EmpiricalDistributionFunctionGraph } from '@/components/EmpiricalDistributionFunctionGraph';
import { VariationSeries } from '@/services/variationSeries';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const data = new VariationSeries([1, 2, 3]);

  return (
    <div className="max-w-1/4 max-h-1/4">
      <EmpiricalDistributionFunctionGraph
        variationSeries={data}
      ></EmpiricalDistributionFunctionGraph>
    </div>
  );
}
