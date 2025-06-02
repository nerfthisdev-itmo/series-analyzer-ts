import { Badge } from "./badge";
import type { SomeTheoreticalDistribution } from "@/services/theoretical/getTheoreticalDistribution";

export function DistributionBadges({
  parameters,
}: {
  parameters: SomeTheoreticalDistribution;
}) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {Object.entries(parameters).map(([key, value]) => (
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
