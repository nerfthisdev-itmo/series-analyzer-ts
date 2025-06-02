import { Badge } from "./badge";
import type { KSTestResult } from "@/services/theoretical/kolmogorovCriteria";
import type { PearsonResult } from "@/services/theoretical/pearsonsCriteria";

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
