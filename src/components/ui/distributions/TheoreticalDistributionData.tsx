import { Badge } from "../badge";
import { DistributionBadges } from "./DistributionBadges";
import { TestResultBadge } from "./tests/TestResultBadge";
import type { PearsonResult } from "@/services/statistical-tests/pearson-test/pearsonTest";
import type { KSTestResult } from "@/services/statistical-tests/kolmogorov-smirnov-test/ksTest";
import type {
  DistributionType,
  SomeTheoreticalDistribution,
} from "@/services/types/distributions";

export function TheoreticalDistributionData({
  resolvedDistributionType,
  characteristics,
  bestDistributionResult,
}: {
  resolvedDistributionType: DistributionType | undefined;
  characteristics: SomeTheoreticalDistribution | undefined;
  bestDistributionResult:
    | { type: DistributionType; result: PearsonResult }
    | { type: DistributionType; result: KSTestResult }
    | undefined;
}) {
  return (
    <div className='space-y-2 w-full'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          <span className='font-medium text-muted-foreground text-sm'>
            Distribution:
          </span>
          <Badge variant='outline' className='font-mono text-sm'>
            {resolvedDistributionType}
          </Badge>
        </div>
        {characteristics != undefined ? (
          <div className='flex items-start gap-1.5'>
            <span className='mt-1 font-medium text-muted-foreground text-sm'>
              Parameters:
            </span>
            <DistributionBadges parameters={characteristics} />
          </div>
        ) : (
          <></>
        )}
      </div>

      {bestDistributionResult && (
        <div className='flex items-center gap-1.5'>
          <span className='font-medium text-muted-foreground text-sm'>
            {"chiSquared" in bestDistributionResult.result
              ? "Pearson:"
              : "Kolmogorov:"}
          </span>
          <TestResultBadge result={bestDistributionResult.result} />
        </div>
      )}
    </div>
  );
}
