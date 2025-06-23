import { Badge } from "../ui/badge";
import type { MultipleRegressionResult } from "@/services/regression/multipleLinearRegression";
import type { RegressionResult } from "@/services/regression/regression";

// Helper function to flatten objects recursively
function flattenObject(
  obj: Record<string, any>,
  prefix = ""
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

export function RegressionBadges({
  parameters,
}: {
  parameters: RegressionResult | MultipleRegressionResult;
}) {
  // Remove residuals from the parameters
  const { residuals, ...params } = parameters as any;

  // Flatten the remaining parameters
  const flattenedParams = flattenObject(params);

  return (
    <div className='flex flex-wrap gap-1.5'>
      {Object.entries(flattenedParams).map(([key, value]) => (
        <Badge
          key={key}
          variant='secondary'
          className='px-2 py-0.5 font-mono text-xs'
        >
          {key}: {typeof value === "number" ? value.toFixed(4) : String(value)}
        </Badge>
      ))}
    </div>
  );
}
