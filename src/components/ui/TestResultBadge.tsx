import { Badge } from "./badge";
import type { PearsonResult } from "@/services/statistical-tests/pearson-test/pearsonTest";
import type { KSTestResult } from "@/services/statistical-tests/kolmogorov-smirnov-test/ksTest";

export function TestResultBadge({
  result,
}: {
  result: PearsonResult | KSTestResult;
}) {
  if ("chiSquared" in result) {
    return (
      <div className='flex items-center gap-1.5'>
        <Badge variant='secondary' className='font-mono text-xs'>
          χ² = {result.chiSquared.toFixed(4)}
        </Badge>
        <Badge variant='secondary' className='text-xs'>
          p = {result.pValue.toFixed(4)}
        </Badge>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1.5'>
      <Badge variant='secondary' className='font-mono text-xs'>
        D = {result.ksStatistic.toFixed(4)}
      </Badge>
      <Badge variant='secondary' className='text-xs'>
        p = {result.pValue.toFixed(4)}
      </Badge>
    </div>
  );
}
