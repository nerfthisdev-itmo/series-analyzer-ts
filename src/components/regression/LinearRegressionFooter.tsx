import { Badge } from "../ui/badge";
import { RegressionBadges } from "./RegressionBadges";
import type { RegressionCoefficientsTestResult } from "@/services/regression/tests/testRegressionCoefficients";
import type { FTestResult } from "@/services/regression/tests/testRegressionModel";
import type { CorrelationTestResult } from "@/services/regression/tests/testPearsonCorrelation";
import type { RegressionResult } from "@/services/regression/regression";

export function LinearRegressionFooter({
  regressionResult,
  coefficientTest,
  modelTest,
  correlationTest,
}: {
  regressionResult: RegressionResult;
  coefficientTest?: RegressionCoefficientsTestResult;
  modelTest?: FTestResult;
  correlationTest?: CorrelationTestResult;
}) {
  return (
    <div className='space-y-2 w-full'>
      {/* Wrap RegressionBadges in a flex-wrap container */}
      <div className='flex flex-wrap gap-2'>
        <RegressionBadges parameters={regressionResult} />
      </div>

      <div className='flex flex-wrap items-center gap-3 p-2 border-t border-dashed'>
        {coefficientTest && (
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-medium text-muted-foreground text-sm'>
              Coefficients:
            </span>
            {Object.entries(coefficientTest).map(([key, value]) => (
              <Badge
                key={key}
                variant='secondary'
                className='font-mono text-xs whitespace-normal'
              >
                {key} = {value.toFixed(2)}
              </Badge>
            ))}
          </div>
        )}

        {modelTest && (
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-medium text-muted-foreground text-sm'>
              Model:
            </span>
            {Object.entries(modelTest).map(([key, value]) => (
              <Badge
                key={key}
                variant='secondary'
                className='font-mono text-xs whitespace-normal'
              >
                {key} = {value.toFixed(2)}
              </Badge>
            ))}
          </div>
        )}

        {correlationTest && (
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-medium text-muted-foreground text-sm'>
              Correlation:
            </span>
            {Object.entries(correlationTest).map(([key, value]) => (
              <Badge
                key={key}
                variant='secondary'
                className='font-mono text-xs whitespace-normal'
              >
                {key} = {value.toFixed(2)}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
